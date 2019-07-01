
const events = require('events'),
	util = require('./util.js'),
	{promisify} = require('util');

class Client extends events {

	constructor() {
		super();
		this.size = null;
		this.compress = false;
		this.buffer = Buffer.from('');
		this.socket = null;
	}

	send(data) {
		return util.package(data, this.compress).then((payload) => {
			return promisify(this.socket.write.bind(this.socket))(payload);
		});
	}

	handleMessage(payload) {
		return this.emit('message', payload);
	}

	close() {
		if (this.socket === null) {
			throw new Error('no socket to close this.socket should not be null');
		}
		try {
			this.socket.destroy();
		} catch(e) {
			// probably closed
		}
	}

	_parse() {
		if (!this.size && this.buffer.length > 0) {
			this.size = this.buffer.readIntLE(0, 6);
			this.buffer = this.buffer.slice(6, this.buffer.length);
		}
		if (this.size !== null && this.buffer.length >= this.size) {
			util.unpackage(this.buffer.slice(0, this.size), this.compress)
				.then((data) => this.handleMessage(data))
				.catch((e) => {
					throw e;
				});

			this.buffer = this.buffer.slice(this.size, this.buffer.length);
			this.size = null;
			this._parse();
		}
	}

}

module.exports = Client;
