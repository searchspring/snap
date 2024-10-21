import { ComponentChildren, Fragment, h } from 'preact';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { observer } from 'mobx-react-lite';

import { SnapTemplates, TemplatesStore } from '../../src';
import { ThemeProvider } from '../src/providers/theme';
import { base, bocachica } from '../src/themes';

// custom styles for storybook
import './styles.scss';
import { SnapProvider, Theme } from '../src';

// snap instance for theming and templates functionality
const snapTemplates = new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		platform: 'other',
	},
	themes: {
		global: {
			extends: 'bocachica',
		},
	},
});

// need to add each theme synchronously
addTheme(snapTemplates, 'bocachica', bocachica);
addTheme(snapTemplates, 'base', base);

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
	(Story: any, context: any) => {
		// if the component is a template we should utilize the themeStore theme
		// otherwise we should use the base theme (stripped of all props except styleScripts)

		const templateStory = context.kind.match(/^Template/);

		const themeDecoratorFn = withThemeFromJSXProvider({
			themes: {
				bocachica: templateStory
					? snapTemplates.templates.themes.library.bocachica.theme
					: snapTemplates.templates.themes.local.bocachicaSimple.theme,
				base: templateStory ? snapTemplates.templates.themes.library.base.theme : snapTemplates.templates.themes.local.baseSimple.theme,
			},
			defaultTheme: 'base',
			Provider: templateStory ? CustomThemeProvider : ThemeProvider,
		});

		return themeDecoratorFn(Story, context);
	},
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

// add the full theme for template stories, and add a "simple" theme for all other stories
function addTheme(snapTemplates: SnapTemplates, themeName: string, theme: Theme) {
	snapTemplates.templates.addTheme({
		name: themeName,
		type: 'library',
		base: theme,
		language: {},
		languageOverrides: {},
		currency: {},
		innerWidth: window.innerWidth,
	});
	snapTemplates.templates.addTheme({
		name: `${themeName}Simple`,
		type: 'local',
		base: generateSimpleTheme(theme),
		language: {},
		languageOverrides: {},
		currency: {},
		innerWidth: window.innerWidth,
	});
}

function generateSimpleTheme(theme: Theme): Theme {
	// strip off everything except for stylescripts and variables

	const simpleTheme: Theme = {
		name: theme.name,
		variables: theme.variables,
		components: {},
	};

	for (const componentName in theme.components) {
		const componentProps = theme.components[componentName as keyof typeof theme.components];
		simpleTheme.components![componentName as keyof typeof simpleTheme.components] = {
			// @ts-ignore - type was removed for overrides
			styleScript: componentProps?.styleScript,
		};
	}

	return simpleTheme;
}
