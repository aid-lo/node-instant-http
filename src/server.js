module.exports = config => {

    const srv = require("express")();

    srv.disable("x-powered-by");

    if (config.trustProxy) srv.set("trust proxy", true);

    if (config.views && config.views.engine) {
        srv.set("view engine", config.views.engine);
        if (config.views.directory) srv.set("views", config.approot + "/" + config.views.directory);
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

    if (config.vhosts) config.vhosts.forEach(domain => srv.use(require("vhost")(domain.host, loadHandler(config.approot + "/" + domain.handler))));

    if (config.handler) srv.use(loadHandler(config.approot + "/" + config.handler));

    srv.use((req, res) => res.status(404).send());

    srv.use((err, req, res, next) => {
        res.status(500).send();
        console.log(err);
    });

    return srv;
}

function loadHandler(handler) {
    if (typeof handler === "string") {
        if (handler.startsWith("./")) handler = handler.slice(1);
        else if (!handler.startsWith("/")) handler = "/" + handler;
        return require(handler);
    }
    return handler;
}
