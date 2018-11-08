const events = require('events'),
	zlib = require('zlib');

class Client extends events {

	constructor() {
		super();
		this.size = null;
		this.buffer = Buffer.from('');
	}

	send(data) {
		return new Promise((resolve) => {
			zlib.deflate(data, (err, d) => {
				if (err) {
					throw err;
				}
				const buf = Buffer.alloc(6);
				buf.writeIntLE(d.length, 0, 6);
				this.socket.write(Buffer.concat([buf, d]), () => {
					resolve();
				});
			});
		});
	}

	handleMessage(payload) {
		return this.emit('message', payload);
	}

	_parse() {
		if (!this.size && this.buffer.length > 0) {
			this.size = this.buffer.readIntLE(0, 6);
			this.buffer = this.buffer.slice(6, this.buffer.length);
		}
		if (this.size !== null && this.buffer.length >= this.size) {
			zlib.unzip(this.buffer.slice(0, this.size), (err, d) => {
				if (err) {
					throw err;
				}
				this.handleMessage(d);
			});

			this.buffer = this.buffer.slice(this.size, this.buffer.length);
			this.size = null;
			this._parse();
		}
	}

}

module.exports = Client;
