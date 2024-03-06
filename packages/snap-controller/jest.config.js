const rootConfig = require('../../jest.base.config.json');
module.exports = {
	...rootConfig,
	displayName: 'snap-controller',
	moduleNameMapper: {
		'^@testing-library/preact$': '<rootDir>/../../node_modules/@testing-library/preact/dist/cjs/index.js',
		'^preact$': '<rootDir>/../../node_modules/preact/dist/preact.js',
		'^preact/hooks$': '<rootDir>/../../node_modules/preact/hooks/dist/hooks.js',
		'^preact/test-utils$': '<rootDir>/../../node_modules/preact/test-utils/dist/testUtils.js',
	},
};
