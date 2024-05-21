/* eslint-disable */
const rootConfig = require('../../jest.base.config.json');
module.exports = {
	...rootConfig,
	displayName: 'snap-toolbox',
	roots: ['<rootDir>/bigcommerce/src', '<rootDir>/magento2/src', '<rootDir>/shopify/src'],
};
