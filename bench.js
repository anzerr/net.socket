
const net = require('./index.js');

const NS_PER_SEC = 1e9;
const uri = 'localhost:' + Math.floor((Math.random() * 1000) + 3756);
let payload = 0,
	start = process.hrtime();

let server = new net.Server(uri);
server.on('message', (res) => {
	if (res.payload.toString() === 'a') {
		payload += 1;
	}
}).on('error', () => {});

server.on('open', () => {
	for (let x = 0; x < 10; x++) {
		let c = new net.Client(uri);
		c.on('connect', () => {
			setInterval(() => c.send('a').catch(() => {}), 1);
		}).on('error', () => {});
	}
});


setTimeout(() => {
	server.close();
	const diff = process.hrtime(start);
	console.log(payload, (diff[0] * NS_PER_SEC + diff[1]) / NS_PER_SEC);
	process.exit(1);
}, 60 * 1000);
