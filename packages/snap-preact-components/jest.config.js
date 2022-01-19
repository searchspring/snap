const rootConfig = require('../../jest.config.json');
module.exports = {
	...rootConfig,
	moduleNameMapper: {
		'^react$': 'preact/compat',
		'^react-dom/test-utils$': 'preact/test-utils',
		'^react-dom$': 'preact/compat',
		'\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
	},
	roots: ['./src/components'],
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	testEnvironment: '<rootDir>/customEnvironment.js',
};
