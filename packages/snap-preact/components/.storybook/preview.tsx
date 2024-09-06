import { h } from 'preact';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import { ThemeProvider } from '../src/providers/theme';
import { bocachica } from '../src/themes';

// custom styles for storybook
import './styles.scss';

export const decorators = [
	withThemeFromJSXProvider({
		themes: {
			bocachica: bocachica,
			none: {},
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
			// custom order of stories
			order: ['Documentation', 'Atoms', 'Molecules', 'Organisms', 'Templates', 'Trackers'],
		},
	},
};
