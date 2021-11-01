const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const es5 = merge(common, {
	mode: 'development',
	entry: './src/bundle.js',
	output: {
		filename: 'bundle.js',
		chunkFilename: 'snap.chunk.[fullhash:8].[id].js',
	},
	target: 'browserslist',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
		],
	},
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
		},
	},
});

const modern = merge(common, {
	mode: 'development',
	entry: './src/index.js',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
		],
	},
	output: {
		filename: 'modern.bundle.js',
		chunkFilename: 'snap.modern.chunk.[fullhash:8].[id].js',
		publicPath: '/dist/',
	},
	target: 'web',
	devtool: 'source-map',
});

module.exports = [es5, modern];
