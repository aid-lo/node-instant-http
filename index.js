const Cluster = require("cluster");
const Dotenv = require("dotenv");
const bcryptTest = require("bcrypt-bench");
const {cpus} = require("os");
const {createServer} = require("https");
const {existsSync, readFileSync} = require("fs");
const {createSecureContext} = require("tls");
const Express = require("express");
const vhost = require("vhost");
const {resolve} = require("path");

// To get app root folder
//console.log(resolve(__dirname).split('/node_modules')[0]);

module.exports = config => {

	config = config ?? {};

	if (Cluster.isPrimary) {

		Dotenv.config();

		let threads = 1;
		if (process.env.NODE_ENV === "production") {
			bcryptTest({quickFactor: 100});
			threads = cpus().length;
		}

		console.log(`> Running in ${process.env.NODE_ENV} mode.\n\n> Initialising ${threads} worker thread${threads > 1 ? "s" : ""}.`);

		let running = 0;
		for (let i = 0; i < threads; i++) Cluster.fork();

		Cluster.on('exit', () => console.log("> A worker died!"));

		Cluster.on('listening', (worker, address) => {
			console.log(`  > Worker ${worker.id} [${worker.process.pid}]: Listening on port ${address.port}.`);
			if (++running === threads) console.log("> Done.\n");
		});
	} else {

		process.env.PORT = process.env.PORT ?? "8080";

		const cert = {
			key: readFileSync(config.key).toString(),
			cert: readFileSync(config.cert).toString()
		};

		if (config.domains) cert.SNICallback = (domain, cb) => {

			if (!config.domains.find(v => domain.match(v.host) && v.key && v.cert && check(v.key, v.cert))) cb();

			function check(keyPath, certPath) {
				if (existsSync(keyPath) && existsSync(keyPath)) {
					cb(null, createSecureContext({
						key: readFileSync(keyPath).toString(),
						cert: readFileSync(certPath).toString()
					}));
					return true;
				}
				return false;
			}
		}

		createServer(cert, (srv => {

			srv.use((req, res, next) => {
				let redirect = false;
				if (req.headers.host.slice(0, 4) === "www.") {
					req.headers.host = req.headers.host.slice(4);
					redirect = true;
				}
				if (req.originalUrl.endsWith("/") && req.originalUrl.length > 1) {
					req.originalUrl = req.originalUrl.slice(0, -1);
					redirect = true;
				}
				if (redirect) res.redirect(301, `${req.protocol}://${req.headers.host}${req.originalUrl}`);
				else next();
	 		});

			if (config.domains) config.domains.forEach(domain => srv.use(vhost(domain.host, domain.handler)));

			if (config.handler) srv.use(config.handler);

			srv.use((req, res) => res.status(404).send());

			srv.use((err, req, res, next) => {
				res.status(500).send();
				console.log(err);
			});

			srv.disable('x-powered-by');
			srv.set('trust proxy', true);
			return srv;
		})(Express())).listen(process.env.PORT);
	}
}
