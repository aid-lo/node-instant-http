# xpress

> Quickly set up configured Node/Express server instances.

I made this module as I was using the same boilerplate code to configure my node server instances. This module can
configure a default host, and/or multiple virtual hosts. Just supply configuration options and the module will take care
of the rest.

When running in production mode, it will automatically enable multithreading to use all available CPUs.

## Installation

Add it as a dependency:

`npm i doji-xpress`

## Usage

```
const xpress = require("xpress");

xpress(config);
```

### Configuration

|   Option   |          | Description
| ---------- | -------- | -----------
| `handler`  |          | The default handler to use. Can be a Router or Express server or any middleware really.
| `key`      | Required | Path to the default SSL key file to use.
| `cert`     | Required | Path to the default SSL cert file to use.
| `domains`  |          | An array of objects with configuration info for each virtual host. (config options detailed in next section.)

### Domains

|   Option   |          | Description
| ---------- | -------- | -----------
| `host`     | Required | The domain name for this virtual host. Can be a string or regular expression.
| `handler`  | Required | The handler to use.
| `key`      |          | Path to the SSL key file to use. (default will be used otherwise.)
| `cert`     |          | Path to the SSL cert file to use. (default will be used otherwise.)
