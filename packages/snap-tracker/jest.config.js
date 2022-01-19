const rootConfig = require('../../jest.config.json');
module.exports = {
	...rootConfig,
	testEnvironment: '<rootDir>/customEnvironment.js',
};
