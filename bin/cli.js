#!/usr/bin/env node

const config = {
    views: {}
};

for (let i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case "-h":
        case "--handler":
            config.handler = process.argv[++i];
            break;
        case "-k":
        case "--sslkey":
            config.key = process.argv[++i];
            break;
        case "-c":
        case "--sslcert":
            config.cert = process.argv[++i];
            break;
        case "--sslfolder":
            let folder = process.argv[++i];
            if (!folder.endsWith("/")) folder += "/";
            config.key = folder + "ssl.key";
            config.cert = folder + "ssl.cert";
            break;
        case "--view-engine":
            config.views.engine = process.argv[++i];
            break;
        case "--views-directory":
            config.views.directory = process.argv[++i];
            break;
        case "--trust-proxy":
            config.trustProxy = true;
            break;
        case "--bcrypt-bench":
            config.bcryptBench = true;
            break;
        case "--dotenv":
            config.dotenv = true;
            break;
    }
}

require("./index")(config);
