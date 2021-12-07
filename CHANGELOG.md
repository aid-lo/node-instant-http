# Changelog

## 1.1.0 (07/12/2021)

- Removed `"type": "module"` from `package.json`.
- Made specifying a default SSL cert optional.
- Now throws an exception if SSL cert files are not specified or are not found.
- Added `vhosts` to config parameters. Functions the same as previous `domains`, but is arguably more semantic.
- Added ability to specify a path string, relative to app root, as a handler parameter instead of an actual route
handler function. The file must be importable by `require()`.
- Added a command line utility to start Xpress instance.

## 1.0.0 (26/11/2021)

- Quickly setup Express server boilerplate.
- Automatic multithreading dependent on NODE_ENV.
- Configure a default route handler and SSL cert.
- Configuration of multiple vhosts with a route handler and SSL cert each.
- Enforces no trailing slash and no www policies.
