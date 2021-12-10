module.exports = config => {
	config.approot = require("path").resolve(__dirname).split("/node_modules")[0];
	if (require("cluster").isPrimary) require("./src/primary")(config);
	else require("./src/worker")(config);
}
