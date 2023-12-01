const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const path = require('path');

function createProxy(app, path, target) {
    const targetUrl = new URL(target);
    const targetBase = targetUrl.origin;
	const targetPath = targetUrl.pathname;

	const apiProxy = createProxyMiddleware(path, {
		target: target,
		changeOrigin: true,
        pathRewrite: (requestPath, req) => {
            return requestPath.replace(path, '');
        },
	});
	app.use(path, apiProxy);
}

const commandLineArgs = require('command-line-args');
const { exit } = require('process');

const optionDefinitions = [
	{ name: 'version', alias: 'v', type: Boolean },
	{ name: 'config', alias: 'c', type: String, multiple: true, defaultOption: false },
	{ name: 'port', alias: 'p', type: Number, multiple: false, defaultOption: false },
	{ name: 'add', alias: 'a', type: routeIpParse, multiple: true },
]

// splititng by ; and then by , is not the best way to do this
// urls including ; or , will break this
function routeIpParse(value) {
	const pairs = value.split(';').map(pair => {
		const [path, target] = pair.split(',');
		return { path, target };
	});

	return pairs;
}

let options;

try {
	options = commandLineArgs(optionDefinitions);
}
catch (e) {
	console.log("usage: revproxy [-v] [-c config.json] [-p port] [-a path,target;path,target;...]");
	exit(1);
}

const port = options.port || 3000;

let proxies = [];

if (options.config)
	for (let i = 0; i < options.config.length; i++)
		proxies = proxies.concat(require(path.resolve(options.config[i])));

if (options.add)
	for (let i = 0; i < options.add.length; i++)
		for (let j = 0; j < options.add[i].length; j++)
			proxies.push(options.add[i][j]);

proxies.forEach(proxy => createProxy(app, proxy.path, proxy.target));

app.listen(port, () => {
	console.log('revproxy listening on http://localhost:' + port);
});