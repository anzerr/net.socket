
const net = require('./index.js'); // example of usage

const uri = 'localhost:' + Math.floor((Math.random() * 1000) + 3756);

let server = new net.Server(uri);
server.on('message', (res) => {
	let client = res.client, payload = JSON.parse(res.payload.toString());
	console.log('Server recieve', client.id(), payload);
	client.send(JSON.stringify({pong: payload}));
});

server.on('open', () => {
	console.log('sever is up');
	let dumy = () => {
		let c = new net.Client(uri);
		c.on('connect', () => {
			console.log('client connected');
			let i = 0;
			setInterval(() => {
				c.send(JSON.stringify({test: 'cat' + i}));
				i++;
			}, 100 + Math.floor(Math.random() * 900));
			c.on('message', (res) => {
				console.log('Client message', JSON.parse(res.toString()));
			});
		});
	};
	for (let i = 0; i < 5; i++) {
		dumy();
	}
});
