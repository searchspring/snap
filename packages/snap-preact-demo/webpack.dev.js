const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const universal = merge(common, {
	mode: 'development',
	entry: './src/universal.js',
	output: {
		filename: 'bundle.js',
		chunkFilename: 'bundle.chunk.[fullhash:8].[id].js',
	},
	target: 'browserslist:universal',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: [/node_modules\/@searchspring/, path.resolve(__dirname, 'src'), path.resolve(__dirname, '../')],
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									browserslistEnv: 'universal',
								},
							],
						],
					},
				},
			},
		],
	},
	devServer: {
		server: 'https',
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
		client: {
			overlay: {
				errors: true,
				warnings: false,
			},
		},
	},
	devtool: 'source-map',
});

const modern = merge(common, {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'modern.bundle.js',
		chunkFilename: 'modern.bundle.chunk.[fullhash:8].[id].js',
	},
	target: 'browserslist:modern',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									browserslistEnv: 'modern',
								},
							],
						],
					},
				},
			},
		],
	},
	devtool: 'source-map',
});

module.exports = [universal, modern];
