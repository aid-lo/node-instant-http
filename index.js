const Cluster = require("cluster");
const {cpus} = require("os");
const {createServer} = require("https");
const {existsSync, readFileSync} = require("fs");
const Express = require("express");
const vhost = require("vhost");
const {resolve} = require("path");

const approot = resolve(__dirname).split("/node_modules")[0];

module.exports = config => {

	if (Cluster.isPrimary) {

		if (config.dotenv) require("dotenv").config();

		let threads = 1;
		if (process.env.NODE_ENV === "production") {
			if (config.bcryptBench) require("bcrypt-bench")();
			threads = cpus().length;
		}

		console.log(`> Running in ${process.env.NODE_ENV} mode.\n\n> Initialising ${threads} worker thread${threads > 1 ? "s" : ""}.`);

		let running = 0;
		for (let i = 0; i < threads; i++) Cluster.fork();

		Cluster.on("exit", () => console.log("> A worker died!"));

		Cluster.on("listening", (worker, address) => {
			console.log(`  > Worker ${worker.id} [${worker.process.pid}]: Listening on port ${address.port}.`);
			if (++running === threads) console.log("> Done.\n");
		});
	} else {

		config = config ?? {};

		process.env.PORT = process.env.PORT ?? "8080";

		if (!config.key && !config.cert) Object.assign(config, [
			{
				key: approot + "/ssl.key",
				cert: approot + "/ssl.cert"
			},
			{
				key: approot + "/conf/ssl.key",
				cert: approot + "/conf/ssl.cert"
			}
		].find(c => existsSync(c.key) && existsSync(c.cert)) ?? {});

		if (!config.key && !config.cert) throw new Error("No default SSL certificate specified or found.");

		const cert = {
			key: readFileSync(config.key, "ascii"),
			cert: readFileSync(config.cert, "ascii")
		};

		if (config.domains && !config.vhosts) config.vhosts = config.domains;

		if (config.vhosts) cert.SNICallback = (domain, cb) => {

			if (!config.vhosts.find(v => domain.match(v.host) && v.key && v.cert && check(v.key, v.cert))) cb();

			function check(keyPath, certPath) {
				if (existsSync(keyPath) && existsSync(certPath)) {
					cb(null, require("tls").createSecureContext({
						key: readFileSync(keyPath, "ascii"),
						cert: readFileSync(certPath, "ascii")
					}));
					return true;
				}
				return false;
			}
		}

		createServer(cert, (srv => {

			srv.disable("x-powered-by");

			if (config.trustProxy) srv.set("trust proxy", true);

			if (config.views && config.views.engine) {
				srv.set("view engine", config.views.engine);
				if (config.views.directory) srv.set("views", approot + "/" + config.views.directory);
			}

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

			if (config.vhosts) config.vhosts.forEach(domain => srv.use(vhost(domain.host, loadHandler(domain.handler))));

			if (config.handler) srv.use(loadHandler(config.handler));

			srv.use((req, res) => res.status(404).send());

			srv.use((err, req, res, next) => {
				res.status(500).send();
				console.log(err);
			});

			return srv;
		})(Express())).listen(process.env.PORT);
	}
}

function loadHandler(handler) {
	if (typeof handler === "string") {
		if (handler.startsWith("./")) handler = handler.slice(1);
		else if (!handler.startsWith("/")) handler = "/" + handler;
		return require(approot + handler);
	}
	return handler;
}
