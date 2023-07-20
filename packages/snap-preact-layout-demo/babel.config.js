module.exports = (api) => {
	api.cache.using(() => process.env.NODE_ENV);

	return {
		presets: [
			[
				'@babel/preset-env',
				{
					modules: false,
					useBuiltIns: 'usage',
					corejs: '3.19',
				},
			],
		],
		plugins: [['@babel/plugin-transform-runtime'], ['@babel/plugin-transform-arrow-functions']],
	};
};
