const base = require('../base.js');

class Client extends base { // server

	constructor(socket, key) {
		super();
		this.socket = socket;
		this.key = key;
		this.socket.on('data', (data) => {
			this.buffer = Buffer.concat([this.buffer, data]);
			this._parse();
		}).on('close', () => {
			// clean up
		}).on('error', () => {
			// clean up
		});
	}

	close() {
		try {
			this.socket.destroy();
		} catch(e) {
		// probably closed
		}
	}

	id() {
		return this.key;
	}

}

module.exports = Client;
