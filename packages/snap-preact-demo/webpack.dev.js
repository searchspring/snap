const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const universal = merge(common, {
	mode: 'development',
	entry: './src/universal.js',
	output: {
		filename: 'universal.bundle.js',
		chunkFilename: 'snap.universal.chunk.[fullhash:8].[id].js',
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
		https: true,
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
	output: {
		filename: 'bundle.js',
		chunkFilename: 'snap.chunk.[fullhash:8].[id].js',
		publicPath: '/dist/',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
		],
	},
	target: 'web',
	devtool: 'source-map',
});

module.exports = [universal, modern];
