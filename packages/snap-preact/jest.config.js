const rootConfig = require('../../jest.base.config.json');
module.exports = {
	...rootConfig,
	displayName: 'snap-preact',
	roots: ['<rootDir>/src', '<rootDir>/components/src'],
	moduleNameMapper: {
		'^react$': 'preact/compat',
		'^react-dom/test-utils$': 'preact/test-utils',
		'^react-dom$': 'preact/compat',
		'^react/jsx-runtime$': 'preact/jsx-runtime',
		'\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
		'^@testing-library/preact$': '<rootDir>/../../node_modules/@testing-library/preact/dist/cjs/index.js',
		'^preact$': '<rootDir>/../../node_modules/preact/dist/preact.js',
		'^preact/hooks$': '<rootDir>/../../node_modules/preact/hooks/dist/hooks.js',
		'^preact/test-utils$': '<rootDir>/../../node_modules/preact/test-utils/dist/testUtils.js',
		'^preact/jsx-runtime$': '<rootDir>/../../node_modules/preact/jsx-runtime/dist/jsxRuntime.js',
	},
	setupFilesAfterEnv: ['<rootDir>/components/src/setupTests.ts'],
	testTimeout: 10000,
};
