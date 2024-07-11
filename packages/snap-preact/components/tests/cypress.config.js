/* eslint-disable */
const { defineConfig } = require('cypress');
const webpackConfig = require('../webpack.config');

module.exports = defineConfig({
	viewportWidth: 1280,
	viewportHeight: 960,
	component: {
		devServer: {
			framework: 'react',
			bundler: 'webpack',
		},
	},
	chromeWebSecurity: false,
	video: false,
	screenshotOnRunFailure: false,
	webpackConfig,
});
