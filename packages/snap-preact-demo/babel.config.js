const dev = process.env.NODE_ENV === 'development';

module.exports = (api) => {
	api.cache.using(() => process.env.NODE_ENV);

	return {
		presets: [
			[
				'@babel/preset-env',
				{
					useBuiltIns: 'entry',
					corejs: {
						version: 3,
					},
				},
			],
			['@babel/preset-react'],
		],
		plugins: [
			['@babel/plugin-transform-runtime'],
			[
				'@babel/plugin-proposal-decorators',
				{
					legacy: true,
				},
			],
			['@babel/plugin-proposal-class-properties'],
			[
				'@babel/plugin-transform-react-jsx',
				{
					pragma: 'h',
					pragmaFrag: 'Fragment',
				},
			],
			['@babel/plugin-transform-arrow-functions'],
			dev && ['@prefresh/babel-plugin'],
		].filter(Boolean),
	};
};
