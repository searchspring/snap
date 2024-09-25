import { ComponentChildren, Fragment, h } from 'preact';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { observer } from 'mobx-react-lite';

import { SnapTemplates, TemplatesStore } from '../../src';
import { ThemeProvider } from '../src/providers/theme';
import { bocachica } from '../src/themes';

// custom styles for storybook
import './styles.scss';
import { SnapProvider, Theme } from '../src';

// snap instance for theming and templates functionality
const snapTemplates = new SnapTemplates({
	config: {
		siteId: '8uyt2m',
	},
	themes: {
		global: {
			extends: 'bocachica',
		},
	},
});

// need to add each theme synchronously

// bocachica
snapTemplates.templates.addTheme({
	name: 'bocachica',
	type: 'library',
	base: bocachica,
	language: {},
	languageOverrides: {},
	currency: {},
	innerWidth: window.innerWidth,
});

const Providers = observer(
	({ templateStore, children, themeName }: { templateStore: TemplatesStore; themeName: string; children: ComponentChildren }) => {
		const themeLocation = templateStore.themes.library[themeName];
		const mergedTheme = themeLocation?.theme || {};
		return (
			<SnapProvider snap={snapTemplates}>
				<ThemeProvider theme={mergedTheme}>{children}</ThemeProvider>
			</SnapProvider>
		);
	}
);

const CustomThemeProvider = ({ theme, children }: { theme: Theme; children: ComponentChildren }) => {
	return (
		<Providers templateStore={snapTemplates.templates} themeName={theme.name!}>
			{children}
		</Providers>
	);
};

export const decorators = [
	withThemeFromJSXProvider({
		themes: {
			bocachica: () => snapTemplates.templates.themes.library.bocachica.theme,
			none: {},
		},
		defaultTheme: 'none',
		Provider: CustomThemeProvider,
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
