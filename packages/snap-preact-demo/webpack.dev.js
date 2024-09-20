const { merge } = require('webpack-merge');
const path = require('path');

// This is used to create the initial dist directory in the virtual dev server
// Other builds require that the dist directory already exists before creating the subdirectories 'snap' and 'templates'
const devServer = {
	mode: 'development',
	entry: './server.js',
	output: {
		filename: 'server.js',
	},
	devtool: 'source-map',
	devServer: {
		server: 'https',
		port: 2222,
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
			publicPath: '/',
		},
		client: {
			overlay: {
				errors: true,
				warnings: false,
				runtimeErrors: false,
			},
		},
	},
};

const modernProd = require('./snap/webpack.modern.js');
const modern = {
	...merge(modernProd, {
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
	}),
	// development overrides
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist/snap'),
		filename: 'bundle.js',
		chunkFilename: 'bundle.chunk.[fullhash:8].[id].js',
	},
	devtool: 'source-map',
};

const modernTemplatesProd = require('./templates/webpack.modern.js');
const modernTemplates = {
	...merge(modernTemplatesProd, {
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
	}),
	// development overrides
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist/templates'),
		filename: 'bundle.js',
		chunkFilename: 'bundle.chunk.[fullhash:8].[id].js',
	},
	devtool: 'source-map',
};

const universalProd = require('./snap/webpack.universal.js');
const universal = {
	...merge(universalProd, {
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
	}),
	// development overrides
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist/snap'),
		filename: 'universal.bundle.js',
		chunkFilename: 'universal.bundle.chunk.[fullhash:8].[id].js',
	},
	devtool: 'source-map',
};

const universalTemplatesProd = require('./templates/webpack.universal.js');
const universalTemplates = {
	...merge(universalTemplatesProd, {
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
	}),
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist/templates'),
		filename: 'universal.bundle.js',
		chunkFilename: 'universal.bundle.chunk.[fullhash:8].[id].js',
	},
	devtool: 'source-map',
};

module.exports = [devServer, modern, modernTemplates, universal, universalTemplates];
