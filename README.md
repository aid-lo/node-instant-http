# xpress

> Quickly set up configured Node/Express server instances.

I made this module as I was using the same boilerplate code to configure my node server instances. This module can
configure a default host, and/or multiple virtual hosts using different domains. Just supply configuration options and
the module will take care of the rest. Nice.

When running in production mode, it will automatically enable multithreading to use all available CPUs.

## Requirements

[bcrypt-test](https://github.com/aid-lo/bcrypt-test)  - Install manually, clone or add as submodule to node_modules. Install its dependencies too.

Use the following command to install the required npm modules :

`npm i express vhost dotenv`

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

## Future

I want this module to be as configurable as possible.

- Make https/ssl optional.
- Make bcrypt-test optional.
- Instruct Node to limit memory usage for low memory environments.
- Configure www and trailing slash enforcement policy on a per-domain basis.  
  *Currently enforces no www and no trailing slash.*
- Configurable multithreading.  
  *Currently uses one or all threads dependent on NODE_ENV.*
- Reduce number of dependencies.
- Configuration loaded from JSON file.
- Initialise through command line without script.
