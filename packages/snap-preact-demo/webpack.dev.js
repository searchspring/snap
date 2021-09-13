const PreactRefreshPlugin = require('@prefresh/webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
	mode: 'development',
	target: 'web',
	devtool: 'source-map',
	devServer: {
		https: false,
		port: 4444,
		hot: true,
		allowedHosts: 'all',
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		static: {
			directory: path.join(__dirname, 'public'),
			publicPath: ['/'],
			watch: true,
		},
		devMiddleware: {
			publicPath: '/dist/',
			writeToDisk: (filePath) => {
				return /bundle\.js.*/.test(filePath);
			},
		},
	},
	plugins: [new PreactRefreshPlugin()],
});
