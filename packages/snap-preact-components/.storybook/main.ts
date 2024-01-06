import type { StorybookConfig } from '@storybook/preact-webpack5';
// Github Flavoured Markdown
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
	framework: '@storybook/preact-webpack5',
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		{
			name: '@storybook/addon-docs',
			options: {
				mdxPluginOptions: {
					mdxCompileOptions: {
						remarkPlugins: [remarkGfm],
					},
				},
			},
		},
		'@storybook/addon-controls',
		'@storybook/addon-actions',
		'@storybook/addon-viewport',
		'@storybook/addon-links',
		'@storybook/addon-themes',
	],
	// typescript: {
	//   reactDocgen: 'react-docgen-typescript',
	//   reactDocgenTypescriptOptions: {
	//     compilerOptions: {
	//       allowSyntheticDefaultImports: false,
	//       esModuleInterop: false,
	//     },
	//     propFilter: () => true,
	//   },
	// },

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

		return config;
	},
};

export default config;
