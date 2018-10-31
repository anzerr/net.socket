const events = require('events');

class Client extends events {

	constructor() {
		super();
		this.size = null;
		this.buffer = Buffer.from('');
	}

	send(data) {
		let d = Buffer.from(data);
		const buf = Buffer.alloc(6);
		buf.writeIntLE(d.length, 0, 6);
		return new Promise((resolve) => {
			this.socket.write(Buffer.concat([buf, d]), () => {
				resolve();
			});
		});
	}

	_parse() {
		if (!this.size && this.buffer.length > 0) {
			this.size = this.buffer.readIntLE(0, 6);
			this.buffer = this.buffer.slice(6, this.buffer.length);
		}
		if (this.size !== null && this.buffer.length >= this.size) {
			this.emit('message', this.buffer.slice(0, this.size));
			this.buffer = this.buffer.slice(this.size, this.buffer.length);
			this.size = null;
			this._parse();
		}
	}

}

module.exports = Client;
