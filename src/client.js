
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
		}).on('close', () => {
			this.emit('close');
		}).on('data', (data) => {
			this.buffer = Buffer.concat([this.buffer, data]);
			this._parse();
		});
	}

	close() {
		try {
			this.socket.destroy();
		} catch(e) {
			// probably closed
		}
	}

	handleConnection() {
		return this.emit('connect');
	}

}

module.exports = Client;
