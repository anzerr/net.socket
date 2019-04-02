
### Intro
light wrapper around nodes net.socket

#### `Install`
``` bash
npm install --save git+https://git@github.com/anzerr/net.socket.git
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