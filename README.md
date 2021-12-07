I made this module as I was using the same boilerplate code to configure my server instances.

# Features

- Enforces no trailing slash and no www policies.  
*(This is my preference but will eventually be configurable.)*


- Automatically use all available CPU threads when running in production mode.  
*(Again, will be configurable in a future version.)*


- Specify a default route handler and SSL certificate.


- Specify multiple vhosts, each with their own route handler and optionally their own SSL certificate.


- Option to run [bcrypt-bench](https://www.npmjs.com/package/bcrypt-bench) when running in production mode, which will find the optimal bcrypt salt round value.


- Command line utility.

## Installation

```
npm i doji-xpress
```

## Usage

### An example

```
const xpress = require("xpress");
const myExpressServer = require("./server.js");
const anotherServer = require("./example.com/server.js");

const config = {
    handler: myExpressServer,
    vhosts: [
        host: /^(www\.)?example\.com$/,
        handler: anotherServer
    ]
};  

xpress(config);
```

### Configuration

|     Option     | Description
| -------------- | -----------
| `handler`      | The default route handler to use, such as an Express server or router. Can also specify a path string relative to the app root directory to an importable file. Not needed if using vhost setup.
| `key`          | Path to the default SSL key file to use. If not specified, Xpress will try to find one in the app root `/` or in the `/conf` folder.
| `cert`         | Path to the default SSL cert file to use. If not specified, Xpress will try to find one in the app root `/` or in the `/conf` folder.
| `bcryptBench`  | Make truthy to run bcrypt-bench
| `domains` or `vhosts` | An optional array of objects with configuration info for each virtual host. Config options are detailed in the following table.

### vhosts Config

|   Option   |          | Description
| ---------- | :------: | -----------
| `host`     | Required | The domain name for this virtual host. Can be a string or a regular expression.
| `handler`  | Required | The route handler to use. Can also specify a path string relative to the app root directory to an importable file.
| `key`      |          | Path to the SSL key file to use. If not specified, the default will be used.
| `cert`     |          | Path to the SSL cert file to use. If not specified, the default will be used.

## CLI Usage

You can now launch an instance through the command line. Not all configuration options are currently available by this
method.

Example:
```
xpress -h ./server.js -k ./ssl.key -c ./ssl.cert
```

### CLI arguments

|    Option   | Short version | Description
| ----------- | :-----------: | :----------
| `--handler` |     `-h`      | The path to a file to import as the route handler.
| `--sslkey`  |     `-k`      | Path to the default SSL key file to use.
| `--sslcert` |     `-c`      | Path to the default SSL cert file to use.

> If the SSL files are not specified then Xpress will try to find them as explained in
> [Usage/Configuration](#Configuration) above.
