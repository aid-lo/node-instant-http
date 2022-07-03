const {isPrimary} = require('cluster');
const Primary = require('./lib/primary.js');
const Worker = require('./lib/worker.js');

/**
 * @param {NodeInstantHTTPConfig} config
 */
module.exports = config =>
	isPrimary ? Primary(config) : Worker(config);

/**
 * @typedef NodeInstantHTTPConfig
 * @property {boolean} [dotenv]
 * @property {number|string} [port]
 * @property {RequestListener} [listener]
 * @property {number|string} [threads]
 * @property {SecureContextOptions & {keyFile:string|null} & {certFile:string|null}} [ssl]
 */
