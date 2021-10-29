const PreactRefreshPlugin = require('@prefresh/webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const prod = require('./webpack.prod.js');
const path = require('path');

module.exports = prod;
// module.exports = merge(common, {
// 	mode: 'development',
// 	entry: './src/index.js',
// 	output: {
// 		filename: 'bundle.js',
// 		chunkFilename: 'snap.chunk.[id].js',
// 		publicPath: '/dist/',
// 	},
// 	target: 'web',
// 	module: {
// 		rules: [
// 			{
// 				test: /\.(js|jsx)$/,
// 				exclude: /node_modules/,
// 				use: {
// 					loader: 'babel-loader',
// 					options: {
// 						presets: ['@babel/preset-env'],
// 					},
// 				},
// 			},
// 		],
// 	},
// 	devtool: 'source-map',
// 	devServer: {
// 		https: false,
// 		port: 4444,
// 		hot: true,
// 		allowedHosts: 'all',
// 		headers: {
// 			'Access-Control-Allow-Origin': '*',
// 		},
// 		static: {
// 			directory: path.join(__dirname, 'public'),
// 			publicPath: ['/'],
// 			watch: true,
// 		},
// 		devMiddleware: {
// 			publicPath: '/dist/',
// 		},
// 	},
// 	plugins: [new PreactRefreshPlugin()],
// });
