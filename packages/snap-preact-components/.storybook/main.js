module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
	typescript: {
		check: false,
		checkOptions: {},
	},

	// altering webpack config
	webpackFinal: async (config) => {
		// typescript
		config.module.rules.push({
			test: /\.(ts|tsx)$/,
			use: [
				{
					loader: require.resolve('ts-loader'),
				},
			],
		});

		config.resolve.extensions.push('.ts', '.tsx');

		// preact
		config.resolve.alias.react = 'preact/compat';
		config.resolve.alias['react-dom'] = 'preact/compat';
		config.resolve.alias['react-dom/test-utils'] = 'preact/test-utils';

		return config;
	},
};
