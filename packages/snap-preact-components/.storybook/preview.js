import { h } from 'preact';
import { ThemeProvider } from '../src/providers/theme';
import { defaultTheme } from '../src/providers/theme';

export const decorators = [
	(Story) => (
		<ThemeProvider theme={defaultTheme}>
			<Story />
		</ThemeProvider>
	),
];

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: { expanded: true },
};
