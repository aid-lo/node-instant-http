const {existsSync, readFileSync} = require("fs");
const https = require("https");

module.exports = config => {

    config = config ?? {};

    process.env.PORT = process.env.PORT ?? "8000";

    if (!config.key && !config.cert) Object.assign(config, [
        {
            key: config.approot + "/ssl.key",
            cert: config.approot + "/ssl.cert"
        },
        {
            key: config.approot + "/conf/ssl.key",
            cert: config.approot + "/conf/ssl.cert"
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

    const srv = require("./server")(config);

    https.createServer(cert, srv).listen(process.env.PORT);
}
