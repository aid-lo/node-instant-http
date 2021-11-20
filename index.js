// TODO: Node.js memory ceiling
// TODO: allow enforce www. and enforce trailing slash to be configured on a per-domain basis

import Cluster from "cluster";
import Dotenv from "dotenv";
import bcryptTest from "bcrypt-test";
import {cpus} from "os";
import {createServer} from "https";
import {existsSync, readFileSync} from "fs";
import {createSecureContext} from 'tls';
import Express from 'express';
import vhost from 'vhost';

export default function(config) {

	config = config ?? {};
	config.domains = config.domains ?? [];

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

		createServer({
			key: readFileSync(config.key).toString(),
			cert: readFileSync(config.cert).toString(),
			SNICallback: (domain, cb) => {

				if (!config.domains.find(i => domain.match(i.host) && i.key && i.cert && check(i.key, i.cert))) cb(Error());

				function check(keyPath, certPath) {
					if (existsSync(keyPath) && existsSync(keyPath)) {
						cb(null, createSecureContext({
							key: readFileSync(keyPath),
							cert: readFileSync(certPath)
						}));
						return true;
					}
					return false;
				}

			}
		}, (srv => {

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

			config.domains.forEach(domain => srv.use(vhost(domain.host, domain.handler)));

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
