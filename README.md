# Fancliq
## Development
### Prerequisites
* Git
* Node v7.6.0+
* [Grunt CLI](https://gruntjs.com/getting-started)

### Download and Install
```bash
$ git clone git@github.com:JPodz/fancliq.git
$ cd fancliq
$ npm install
```

### Make Your Changes
All source files live in _web/src/_.

### Test Changes
```bash
$ grunt
```
This will start a server that can be viewed at http://localhost:3000 in your browser. Changes made while the server is running will automatically be built without restarting the server.

### Deployment
Save the _fancliq.pem_ file to `~/.ssh/fancliq.pem`. Be sure to set the correct permissions with `sudo chown 400 ~/.ssh/fancliq.pem`.
```bash
$ grunt deploy --key=/path/to/fancliq.pem
```