const {cpus} = require('os');
const Cluster = require('cluster');

/**
 * @param {NodeInstantHTTPConfig} [config]
 */
module.exports = (config = {}) => {

    // Load environment variables
    if (config.dotenv !== false) try {
        require('dotenv').config();
        console.log('Dotenv loaded.');
    } catch (e) {}

    // Configure clustering
    const threads = Number(process.env.NODE_HTTP_THREADS ?? config.threads ?? (process.env.NODE_ENV === 'production' ? cpus().length : 1));
    console.log(`Initialising ${threads} worker${threads > 1 ? "s" : ""}.`);
    for (let i = 0; i < threads; i++) Cluster.fork();

    // Log cluster events
    Cluster.on('exit', (worker, code, signal) =>
        console.log(`Worker ${worker.id} [${worker.process.pid}] died! (${signal || code})`));
    Cluster.on('listening', (worker, address) =>
        console.log(`Worker ${worker.id} [${worker.process.pid}]: Listening on port ${address.port}.`))
};
