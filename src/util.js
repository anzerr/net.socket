
const zlib = require('zlib'),
	{promisify} = require('util');

const zlip = {
	deflate: promisify(zlib.deflate),
	unzip: promisify(zlib.unzip),
};

class Util {

	appendSize(data) {
		if (data.length >= 0xffffff) {
			throw new Error('payload is larger then the packet max size.');
		}
		const buf = Buffer.alloc(6);
		buf.writeIntLE(data.length, 0, 6);
		return Buffer.concat([buf, data]);
	}

	package(data, compress) {
		if (!compress) {
			return Promise.resolve(this.appendSize(Buffer.isBuffer(data, Buffer) ? data : Buffer.from(data)));
		}
		return zlip.deflate(data).then((d) => this.appendSize(d));
	}

	unpackage(data, compress) {
		if (!compress) {
			return Promise.resolve(data);
		}
		return zlip.unzip(data);
	}

}

module.exports = new Util();
