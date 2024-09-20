const { merge } = require('webpack-merge');
const common = require('../webpack.common.js');
const path = require('path');
const childProcess = require('child_process');
const branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

module.exports = merge(common, {
	mode: 'production',
	entry: './snap/src/universal.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'universal.bundle.js',
		chunkFilename: 'universal.bundle.chunk.[fullhash:8].[id].js',
		chunkLoadingGlobal: `${branchName}BundleChunks`,
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
});
