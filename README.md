# node-instant-http

This module allows you to quickly spin up a Node HTTP server programmatically or by CLI.
~~Out of the box it works great as a simple static file server for development.~~ _(soon)_
It can also be useful to pair with an existing server or Express app etc. to handle its clustering and SSL.

## Features

- Handles clustering/multiple threads automatically.
- Supports SSL.
- Attach a `requestListener` such as a function or an Express app etc.

## Installation

Install as a devDependency with NPM:

```
npm i -D github:aidlran/node-instant-http#2.x
```

## Usage

### In Code

The module exports a function that accepts an object for config. 

```js
const http = require('node-instant-http');

const config = {
  port: 8080
};

http(config);
```

**Configuration options:**

- `dotenv`: Dotenv is automatically loaded if it is installed. Set to `false` to prevent this.
- `listener`: A `requestListener` for the HTTP server, such as a function or an Express app.
- `port`: Port number for the server to use. Defaults to `8000`.
- `ssl`: An object for `tls.createSecureContext`. See: [SSL configuration](#ssl).
- `threads`: Number of threads to use. Defaults to maximum available in production mode, and `1` in all other cases.

### CLI

```sh
node-instant-http -p 8080 -l app.js
```

**Configuration options**

Paths can be absolute or relative to the working directory.

- `--listener` or `-l`: Path to a module exporting a `requestListener` for the HTTP server, such as a function or an Express app.
- `--no-dotenv`: Dotenv is automatically loaded if it is installed. This flag will prevent that.
- `--port [n]` or `-p [n]`: Port number for the server to use. Defaults to `8000`.
- `--ssl`: Use `key.pem` and `cert.pem` in the current working directory.
- `--ssl-dir [dir]`: Path to a directory containing `key.pem` and `cert.pem`.
- `--ssl-cert [file]` or `-c [file]`: Path to the SSL certificate file.
- `--ssl-key [file]` or `-k [file]`: Path to the SSL key file.
- `--ssl-passphrase [string]`: Passphrase for the SSL certificate. **Not recommended - use environment variable instead.**
- `--threads [n]` or `-t [n]`: Number of threads to use. Defaults to maximum available in production mode, and `1` in all other cases.

> Note: only one of `--ssl`, `--ssl-dir`, or (`--ssl-cert` & `--ssl-key`) is needed to configure SSL.

## Environment Variables

Environment variables can also be used to customise the configuration.
**In this package, environment variables will take precedence over other configuration methods and will override their values.**

See: [Node.js documentation](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs) for setting environment variables in Bash,
and see also the [cross-env](https://www.npmjs.com/package/cross-env) package for setting them in a cross-platform friendly way.

`node-instant-http` also supports the [dotenv](https://www.npmjs.com/package/dotenv) package with no extra configuration necessary.
If installed, `dotenv` will automatically be loaded. You can use `--no-dotenv` or `dotenv: false` to prevent this.

**Available variables:**

- `NODE_ENV`: Set to `production` to enable production mode for this and other modules.
- `NODE_HTTP_PORT`: Port number for the server to use. Defaults to `8000`.
- `NODE_HTTP_SSL_CERTFILE`: Path to the SSL certificate file.
- `NODE_HTTP_SSL_KEYFILE`: Path to the SSL key file.
- `NODE_HTTP_SSL_PASSPHRASE`: Passphrase for the SSL certificate.
- `NODE_HTTP_THREADS`: Number of threads to use. Defaults to maximum available in production mode, and `1` in all other cases.

## SSL

Enabling SSL means that the server will use `https://` **only.** `http://` will be unavailable.

You'll need an SSL certificate. You can generate a self-signed certificate with `openssl`.

### In Code

SSL is configured in `node-instant-http` using the `ssl` config property. This is a config object for [`tls.createSecureContext`](https://nodejs.org/api/tls.html#tlscreatesecurecontextoptions),
but with the additional properties `keyFile` and `certFile` to use, which will load the files as ASCII encoded.
You can therefore load your SSL certificate like so:

```js
const http = require('node-instant-http');

http({
	ssl: {
		keyFile: 'key.pem',
		certFile: 'cert.pem',
		passphrase: "1234" // use NODE_HTTP_SSL_PASSPHRASE instead
	}
});
```

### CLI

SSL can also be configured in the CLI in a similar fashion:

```sh
node-instant-http -k key.pem -c cert.pem
```

To make things easier, if your files follow the above naming conventions and are located in the same working directory,
you can use `--ssl` instead. Alternatively, use `--ssl-dir [path]` if they are located in a different directory.

If your SSL certificate has a passphrase, you probably don't want it appearing in the codebase or in your Bash logs.
Set `NODE_HTTP_SSL_PASSPHRASE` in your `.env` to avoid this (make sure to add `.env` to your `.gitignore` too).
