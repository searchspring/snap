const rootConfig = require('../../jest.base.config.json');
module.exports = {
	...rootConfig,
	displayName: 'snap-toolbox',
	roots: ['<rootDir>/src/bigCommerce/src', '<rootDir>/src/magento2/src', '<rootDir>/src/shopify/src'],
};
