#!/usr/bin/env node

const config = {};

for (let i = 2; i < process.argv.length - 1; i++) {
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
    }
}

require("./index")(config);
