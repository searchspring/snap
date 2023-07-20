const webpack = require('webpack');
const childProcess = require('child_process');

// determine branch name for branch override usage
const branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

// class name for for branch override usage
const styleClass = 'ss-snap-bundle-styles';

module.exports = {
	stats: {
		modulesSort: 'size',
		modulesSpace: 70,
	},
	plugins: [
		new webpack.DefinePlugin({
			BRANCHNAME: `"${branchName}"`,
		}),
		// to disable code splitting, include the following:
		// new webpack.optimize.LimitChunkCountPlugin({
		// 	maxChunks: 1,
		// }),
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			react: 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat',
		},
	},
};
