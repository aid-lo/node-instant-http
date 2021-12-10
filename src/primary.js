const Cluster = require("cluster");

module.exports = config => {

    // Load environment variables
    if (config.dotenv) require("dotenv").config();

    // Production environment only block
    // Configure threads and run bcrypt-bench if enabled
    let threads = config.threads ?? 1;
    if (process.env.NODE_ENV === "production") {
        if (config.bcryptBench) require("bcrypt-bench")();
        if (!config.threads) threads = require("os").cpus().length;
    }

    console.log(`> Running in ${process.env.NODE_ENV} mode.\n\n> Initialising ${threads} worker thread${threads > 1 ? "s" : ""}.`);

    // Launch threads
    let running = 0;
    for (let i = 0; i < threads; i++) Cluster.fork();

    Cluster.on("exit", () => console.log("> A worker died!"));

    Cluster.on("listening", (worker, address) => {
        console.log(`  > Worker ${worker.id} [${worker.process.pid}]: Listening on port ${address.port}.`);
        if (++running === threads) console.log("> Done.\n");
    });
}
