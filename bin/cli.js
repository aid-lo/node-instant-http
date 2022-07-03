#!/usr/bin/env node

const {resolve, join} = require('path');

/**
 * @type NodeInstantHTTPConfig
 */
const config = {
    ssl: {}
};

for (let i = 2; i < process.argv.length; i++) switch (process.argv[i]) {
    case '-p':
    case '--port':
        config.port = process.argv[++i];
        break;
    case '-t':
    case '--threads':
        config.threads = process.argv[++i];
        break;
    case '-l':
    case '--listener':
        config.listener = resolve(process.argv[++i]);
        break;
    case '-k':
    case '--ssl-key':
        config.ssl.keyFile = resolve(process.argv[++i]);
        break;
    case '-c':
    case '--ssl-cert':
        config.ssl.certFile = resolve(process.argv[++i]);
        break;
    case '--ssl-passphrase':
        config.ssl.passphrase = process.argv[++i];
        break;
    case '--ssl-dir':
        defaultSSL(process.argv[++i]);
        break;
    case '--ssl':
        defaultSSL();
        break;
    case '--no-dotenv':
        config.dotenv = false;
        break;
}

if (Object.getOwnPropertyNames(config.ssl).length === 0) delete config.ssl;

require('../index.js')(config);

function defaultSSL(dir = '.') {
    dir = resolve(dir);
    config.ssl.keyFile = join(dir, 'key.pem');
    config.ssl.certFile = join(dir, 'cert.pem');
}
