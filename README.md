I made this module as I was using the same boilerplate code to configure my server instances.

# Features

- Configure an Express server with a variety of methods.


- Enforces no trailing slash and no www policies.  
*(This is my preference but will eventually be configurable.)*


- Automatically use all available CPU threads when running in production mode.  
*(Again, will be configurable in a future version.)*


- Specify a default route handler and SSL certificate.


- Specify multiple vhosts, each with their own route handler and optionally their own SSL certificate.


- Option to run [bcrypt-bench](https://www.npmjs.com/package/bcrypt-bench) when running in production mode, which will find the optimal bcrypt salt round value.


- Command line utility.

# Installation

```
npm i doji-xpress
```

# Usage

Xpress can be initialised in code, or by command line, so it can be used in a NPM script.

## In Code

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

## CLI

```
xpress -h ./server.js -k ./ssl.key -c ./ssl.cert
```

# Configuration

## Parameters Object

| Option        | Description
| :------------ | :----------
| `handler`     | The default route handler to use, such as an Express server or router. Can also specify a path string relative to the app root directory to an importable file. Not needed if using vhost setup.
| `key`         | Path to the default SSL key file to use. If not specified, Xpress will try to find one in the app root `/` or in the `/conf` folder.
| `cert`        | Path to the default SSL cert file to use. If not specified, Xpress will try to find one in the app root `/` or in the `/conf` folder.
| `bcryptBench` | Make truthy to run bcrypt-bench.
| `dotenv`      | Make truthy to run Dotenv.
| `domains` or `vhosts` | An optional array of objects with configuration info for each virtual host. Config options are detailed in the following table.
| `views`       | An optional object that contains `engine` & optionally `directory` for configuring the view engine. 
| `trustProxy`  | Specify as true to enable trust proxy.

### vhosts Config

| Option     |          | Description
| :--------- | :------: | :----------
| `host`     | Required | The domain name for this virtual host. Can be a string or a regular expression.
| `handler`  | Required | The route handler to use. Can also specify a path string relative to the app root directory to an importable file.
| `key`      |          | Path to the SSL key file to use. If not specified, the default will be used.
| `cert`     |          | Path to the SSL cert file to use. If not specified, the default will be used.

## CLI arguments

| Option      | Short version | Description
| :---------- | :-----------: | :----------
| `--handler` |     `-h`      | The path to a file to import as the route handler.
| `--sslkey`  |     `-k`      | Path to the default SSL key file to use. If not specified, Xpress will try to find one in the app root `/` or in the `/conf` folder.
| `--sslcert` |     `-c`      | Path to the default SSL cert file to use. If not specified, Xpress will try to find one in the app root `/` or in the `/conf` folder.
| `--sslfolder` |             | Path to the folder where SSL key and cert exist. Alternative to specifying key/cert separately.
| `--view-engine` |           | A view engine to use.
| `--views-directory` |       | A custom views directory.
| `--trust-proxy` |           | Include to enable trust proxy.
| `--bcrypt-bench` |          | Include to run bcrypt-bench. (Be sure to include as a dependency in your project.)
| `--dotenv` |                | Include to run Dotenv. (Be sure to include as a dependency in your project.)

## Config file

Planned

## Environment variables

| Option | Description
| :----- | :----------
| `PORT` | Specify the port number to listen on.
