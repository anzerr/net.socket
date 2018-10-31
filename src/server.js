const url = require('url'),
	{createServer} = require('net'),
	events = require('events'),
	Client = require('./server/client.js');

class Server extends events {

	constructor(uri) {
		super();
		this.uri = url.parse((uri.match(/^.*?:\/\//)) ? uri : 'tcp://' + uri);
		this.socket = {};
		this.server = createServer((socket) => {
			let key = this.key();
			socket.on('close', () => {
				this.socket[key] = null;
			}).on('error', () => {
				this.socket[key] = null;
			});
			this.socket[key] = new Client(socket, key);
			this.socket[key].on('message', (data) => {
				this.emit('message', {client: this.socket[key], payload: data});
			});
			this.emit('connect', this.socket[key]);
		});
		this.server.on('error', (e) => {
			this.emit('error', e);
		});
		this.server.listen({host: this.uri.hostname, port: this.uri.port}, () => {
			this.emit('open');
		});
	}

	key() {
		return new Date().getTime() + '.' + Math.random().toString(36).substr(2);
	}

}

module.exports = Server;
