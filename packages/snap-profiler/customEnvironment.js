const NodeEnvironment = require('jest-environment-jsdom');

// A custom environment to set the TextEncoder.
module.exports = class CustomEnvironment extends NodeEnvironment {
	async setup() {
		await super.setup();
		if (typeof this.global.TextEncoder === 'undefined') {
			const { TextEncoder } = require('util');
			this.global.TextEncoder = TextEncoder;
		}
	}
};
