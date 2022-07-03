const fs = require('fs');
const HTTP = require('http');
const HTTPS = require('https');

/**
 * @param {NodeInstantHTTPConfig} [config]
 */
module.exports = (config = {}) => {

	if (process.env.NODE_HTTP_SSL_KEYFILE || process.env.NODE_HTTP_SSL_CERTFILE || process.env.NODE_HTTP_SSL_PASSPHRASE) {
		if (!config.ssl) config.ssl = {};
		for (const i of [['KEYFILE', 'keyFile'], ['CERTFILE', 'certFile'], ['PASSPHRASE', 'passphrase']]) {
			const env = process.env["NODE_HTTP_SSL_" + i[0]];
			if (env) config.ssl[i[1]] = env;
		}
	}

	(config.ssl ? (() => {
		if (config.ssl.keyFile) config.ssl.key = readAscii(config.ssl.keyFile);
		if (config.ssl.certFile) config.ssl.cert = readAscii(config.ssl.certFile);
		return HTTPS;
	})() : HTTP).createServer(config.ssl, config.listener).listen(process.env.NODE_HTTP_PORT ?? config.port ?? 8000);
}

function readAscii(path) {
	return fs.readFileSync(path, 'ascii');
}
