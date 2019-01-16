
const zlib = require('zlib'),
	{promisify} = require('util'),
	is = require('type.util');

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
			return Promise.resolve(this.appendSize(is.instance(data, Buffer) ? data : Buffer.from(data)));
		}
		return promisify(zlib.deflate)(data).then((d) => {
			return this.appendSize(d);
		});
	}

	unpackage(data, compress) {
		if (!compress) {
			return Promise.resolve(data);
		}
		return promisify(zlib.unzip)(data);
	}

}

module.exports = new Util();
