import { h } from 'preact';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import { ThemeProvider, defaultTheme } from '../src/providers/theme';
import './styles.css';
import { bocachica, pike } from '../src/themes';

export const decorators = [
	withThemeFromJSXProvider({
		themes: {
			bocachica: bocachica,
			pike: pike,
		},
		defaultTheme: 'bocachica',
		Provider: ThemeProvider,
	}),
];

export const parameters = {
	actions: {
		argTypesRegex: '^on[A-Z].*',
		disabled: false,
	},
	controls: {
		expanded: true,
		disabled: false,
	},
	options: {
		showPanel: true,
		storySort: {
			order: ['Documentation', 'Components'],
		},
	},
};
