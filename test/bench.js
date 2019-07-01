
const net = require('../index.js');

const NS_PER_SEC = 1e9;
const uri = 'localhost:' + Math.floor((Math.random() * 1000) + 3756);
let payload = 0,
	start = process.hrtime();

const compress = false;

let server = new net.Server(uri, compress);
server.on('message', (res) => {
	if (res.payload.toString() === 'a') {
		payload += 1;
	} else {
		throw new Error(`wrong payload "${res.payload.toString()}"`);
	}
}).on('error', () => {});

server.on('open', () => {
	for (let x = 0; x < 10; x++) {
		let c = new net.Client(uri, compress);
		c.on('connect', () => {
			setInterval(() => {
				for (let v = 0; v < 10; v++) {
					c.send('a').catch(() => {});
				}
			}, 1);
		}).on('error', () => {});
	}
});

console.log('running bench for 30sec');
setTimeout(() => {
	server.close();
	const diff = process.hrtime(start), sec = (diff[0] * NS_PER_SEC + diff[1]) / NS_PER_SEC;
	console.log(payload, payload / sec, sec);
	process.exit(1);
}, 30 * 1000);
