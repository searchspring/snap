const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
	mode: 'production',
	target: 'browserslist',
	devServer: {
		client: false,
		https: false,
		port: 4444,
		hot: false,
		allowedHosts: 'all',
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		static: {
			directory: path.join(__dirname, 'public'),
			publicPath: ['/'],
			watch: false,
		},
		devMiddleware: {
			publicPath: '/dist/',
		},
	},
});
