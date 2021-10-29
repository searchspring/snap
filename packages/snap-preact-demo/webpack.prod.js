const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const es5 = merge(common, {
	mode: 'production',
	entry: './src/bundle_entry.js',
	output: {
		filename: 'bundle.js',
		chunkFilename: 'snap.chunk.[id].js',
	},
	target: 'browserslist',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				// include: /@searchspring\/*/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									modules: false,
									useBuiltIns: 'usage',
									corejs: '3.18',
								},
							],
						],
					},
				},
			},
		],
	},
});

const es6 = merge(common, {
	mode: 'production',
	entry: './src/index.js',
	output: {
		filename: 'modern.bundle.js',
		chunkFilename: 'snap.modern.chunk.[fullhash:8].[id].js',
		publicPath: '/dist/',
	},
	target: 'web',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
});

module.exports = [es5, es6];
