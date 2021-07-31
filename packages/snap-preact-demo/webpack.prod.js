const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
	mode: 'production',
	target: 'browserslist',
	devServer: {
		https: true,
		port: 3333,
		hot: false,
		publicPath: '/dist/',
		disableHostCheck: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
});
