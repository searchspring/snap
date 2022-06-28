module.exports = {
	core: {
		builder: 'webpack5',
	},
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		{
			name: '@storybook/addon-docs',
			options: {
				configureJSX: true,
				babelOptions: {},
				transcludeMarkdown: true,
				inlineStories: true,
				sourceLoaderOptions: null,
			},
		},
		'@storybook/addon-controls',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
	],

	typescript: {
		check: false,
		checkOptions: {},
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
		},
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
