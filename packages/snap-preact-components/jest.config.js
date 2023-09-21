// eslint-disable-next-line @typescript-eslint/no-var-requires
const rootConfig = require('../../jest.base.config.json');
module.exports = {
	...rootConfig,
	displayName: 'snap-preact-components',
	moduleNameMapper: {
		'^react$': 'preact/compat',
		'^react-dom/test-utils$': 'preact/test-utils',
		'^react-dom$': 'preact/compat',
		'\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
	},
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	testTimeout: 10000,
};
