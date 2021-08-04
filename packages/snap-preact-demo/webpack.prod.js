const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
	mode: 'production',
	devServer: {
		https: false,
		port: 4444,
		contentBase: [path.join(__dirname, 'public')],
		contentBasePublicPath: ['/'],
		hot: false,
		publicPath: '/dist/',
		disableHostCheck: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
});
