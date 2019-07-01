
const url = require('url'),
	{createServer} = require('net'),
	events = require('events'),
	Client = require('./server/client.js');

class Server extends events {

	constructor(uri, compress = false) {
		super();
		this.uri = url.parse((uri.match(/^.*?:\/\//)) ? uri : 'tcp://' + uri);
		this.socket = {};
		this.compress = compress;
		this.server = createServer((socket) => {
			let key = this.key();
			socket.on('close', () => {
				this.socket[key] = null;
			}).on('error', () => {
				this.socket[key] = null;
			});
			this.socket[key] = this.createClient(socket, key);
			this.socket[key].on('message', (data) => {
				this.handleMessage(data, this.socket[key]);
			});
			this.emit('connect', this.socket[key]);
		});
		this.server.on('error', (e) => {
			this.emit('error', e);
		});
		this.server.on('close', (e) => {
			this.emit('close', e);
		});
		this.server.listen({host: this.uri.hostname, port: this.uri.port}, () => {
			this.emit('open');
		});
		this._key = {
			magic: `${Date.now()}.${Math.random().toString(36).substr(2)}`,
			count: 0
		};
	}

	close() {
		for (let i in this.socket) {
			if (this.socket[i]) {
				this.socket[i].close();
			}
		}
		return new Promise((resolve) => {
			this.server.close(() => {
				resolve();
			});
		});
	}

	handleMessage(payload, client) {
		return this.emit('message', {client: client, payload: payload});
	}

	createClient(socket, key) {
		return new Client(socket, key, this.compress);
	}

	key() {
		return `${this._key.magic}.${this._key.count++}`;
	}

}

module.exports = Server;
