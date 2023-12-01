# Revproxy

A simple reverse proxy. It routes requests to different hosts based on the request path.

## Usage

### Port
You can specify the port to listen on with the `-p` flag or with `--port`. The default port is `3000`.

### Configuration
You can specify the configuration file with the `-c` flag or with `--config`. You can add multiple configuration files. A configuration file is a json like this.

```json
[
  {
    "path": "/",
    "target": "http://localhost:8081"
  },
  {
    "path": "/api",
    "target": "http://localhost:8082"
  }
]
```

### Add

You can add a new configuration with the `-a` flag or with `--add`. The syntax is `path,target;path,target;...`. You can add multiple configurations at once.

## Example of usage

This example shows all options:

`revproxy -p 4000 -c proxies-1.json --add '/cane,http://localhost:8083,/casa,http://localhost:8084' --config proxies-2.json -a '/capra,http://localhost:8085'`

