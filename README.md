
### Intro
![GitHub Actions status | linter](https://github.com/anzerr/net.socket/workflows/linter/badge.svg)
![GitHub Actions status | publish](https://github.com/anzerr/net.socket/workflows/publish/badge.svg)
![GitHub Actions status | test](https://github.com/anzerr/net.socket/workflows/test/badge.svg)

Light wrapper around nodes net.socket

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/net.socket.git
npm install --save @anzerr/net.socket
```

### `Example`
Server
``` javascript
const net = require('net.socket');
let server = new net.Server('localhost:596');
server.on('message', (res) => {
	let client = res.client, payload = JSON.parse(res.payload.toString());
	console.log('Server recieve', client.id(), payload);
	client.send(JSON.stringify({pong: payload}));
});
```

Client
``` javascript
const net = require('net.socket');
let c = new net.Client('localhost:596');
c.on('connect', () => {
	console.log('client connected');
	c.send(JSON.stringify({test: 'cat10'}));
	c.on('message', (res) => {
		console.log('Client message', JSON.parse(res.toString()));
	});
});
```