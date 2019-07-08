
const url = require('url'),
	{Socket} = require('net'),
	base = require('./base.js');

class Client extends base {

	constructor(uri, compress = false) {
		super();
		this.compress = compress;
		this.uri = url.parse((uri.match(/^.*?:\/\//)) ? uri : 'tcp://' + uri);
		this.socket = new Socket();
		this.socket.connect(this.uri.port, this.uri.hostname, () => {
			this.handleConnection();
		});
		this.socket.on('error', (err) => {
			this.emit('error', err);
		}).on('close', () => {
			this.emit('close');
		}).on('data', (data) => {
			this.buffer = Buffer.concat([this.buffer, data]);
			this._parse();
		});
	}

	handleConnection() {
		return this.emit('connect');
	}

}

module.exports = Client;
