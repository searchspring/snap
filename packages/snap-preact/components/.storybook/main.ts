import type { StorybookConfig } from '@storybook/preact-webpack5';

const config: StorybookConfig = {
	framework: '@storybook/preact-webpack5',
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-docs',
		'@storybook/addon-controls',
		'@storybook/addon-actions',
		'@storybook/addon-viewport',
		'@storybook/addon-links',
		'@storybook/addon-themes',
	],

	// altering webpack config
	webpackFinal: async (config) => {
		// typescript
		config.module?.rules?.push({
			test: /\.(ts|tsx)$/,
			use: [
				{
					loader: require.resolve('ts-loader'),
				},
			],
		});

		config.resolve?.extensions?.push('.ts', '.tsx');

		// sass support
		config.module?.rules?.push({
			test: /\.(css|scss)$/,
			sideEffects: true,
			use: ['style-loader', 'css-loader', 'sass-loader'],
		});

		return config;
	},
};

export default config;
