# Changelog

## 2.0.1 (2022-07-03)

- `config.listener` may now be an import path string instead, in which case it'll be imported when it's needed.
- Addresses problematic behaviour when importing the listener too early in `cli.js`.

## 2.0.0 (2022-07-03)

- Complete rewrite, removing all dependencies and extraneous functionality. See the new [README](README.md).

## 1.3.2 (2021-12-10)

- Fixed CLI

## 1.3.0 (2021-12-10)

- Restructured code.
- Removed SSL requirement. Server will launch HTTP server instead if no valid SSL certificate is available.

## 1.2.0 (2021-12-10)

- Added configuration of view engine, views directory, and trust proxy.
- Removed Dotenv dependency. Must specify in config to run `Dotenv.config()` now.
- Specify `--bcrypt-bench` in CLI.

## 1.1.0 (2021-12-07)

- Removed `"type": "module"` from `package.json`.
- Made specifying a default SSL cert optional.
- Now throws an exception if SSL cert files are not specified or are not found.
- Added `vhosts` to config parameters. Functions the same as previous `domains`, but is arguably more semantic.
- Added ability to specify a path string, relative to app root, as a handler parameter instead of an actual route
handler function. The file must be importable by `require()`.
- Added a command line utility to start Xpress instance.

## 1.0.0 (2021-11-26)

- Quickly setup Express server boilerplate.
- Automatic multithreading dependent on NODE_ENV.
- Configure a default route handler and SSL cert.
- Configuration of multiple vhosts with a route handler and SSL cert each.
- Enforces no trailing slash and no www policies.
