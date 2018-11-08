const url = require('url'),
	{Socket} = require('net'),
	base = require('./base.js');

class Client extends base {

	constructor(uri) {
		super();
		this.uri = url.parse((uri.match(/^.*?:\/\//)) ? uri : 'tcp://' + uri);
		this.socket = new Socket();
		this.socket.connect(this.uri.port, this.uri.hostname, () => {
			this.handleConnection();
		});
		this.socket.on('error', (err) => {
			this.emit('error', err);
		});
		this.socket.on('close', () => {
			this.emit('close');
		});
		this.socket.on('data', (data) => {
			this.buffer = Buffer.concat([this.buffer, data]);
			this._parse();
		});
	}

	close() {
		this.socket.destroy();
	}

	handleConnection() {
		return this.emit('connect');
	}

}

module.exports = Client;
