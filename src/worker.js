const fs = require("fs");

module.exports = config => {

	config = config ?? {};

	process.env.PORT = process.env.PORT ?? "8000";

	if (config.domains && !config.vhosts) config.vhosts = config.domains;

	if (!config.key && !config.cert) Object.assign(config, [
		{
			key: config.approot + "/ssl.key",
			cert: config.approot + "/ssl.cert"
		},
		{
			key: config.approot + "/conf/ssl.key",
			cert: config.approot + "/conf/ssl.cert"
		}
	].find(c => fs.existsSync(c.key) && fs.existsSync(c.cert)) ?? {});

	const srv = require("./server")(config);

	(() => {

		if (config.key && config.cert) {

			const cert = {
				key: readAscii(config.key),
				cert: readAscii(config.cert)
			};

			if (config.vhosts) cert.SNICallback = (domain, cb) => {

				if (!config.vhosts.find(v => domain.match(v.host) && v.key && v.cert && check(v.key, v.cert))) cb();

				function check(keyPath, certPath) {
					if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
						cb(null, require("tls").createSecureContext({
							key: readAscii(keyPath),
							cert: readAscii(certPath)
						}));
						return true;
					}
					return false;
				}
			}

			return require("https").createServer(cert, srv);

		} else return require("http").createServer(srv);

	})().listen(process.env.PORT);
}

function readAscii(path) {
	return fs.readFileSync(path, "ascii");
}
