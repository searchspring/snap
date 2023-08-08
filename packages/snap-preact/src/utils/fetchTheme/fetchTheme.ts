import type { Theme } from '@searchspring/snap-preact-components';
import type { SnapThemeConfig } from '../../types';
import deepmerge from 'deepmerge';

export const fetchTheme = async (themeConfig: SnapThemeConfig): Promise<Theme> => {
	let theme: Theme = {};

	const themeImport = themeConfig?.import;
	const themeVariables = themeConfig?.variables || {};
	const themeOverrides = themeConfig?.overrides || {};
	if (themeImport) {
		// dynamically import the theme
		theme = await themeImport();
		// merge specified theme variables with the theme
		theme = deepmerge(theme, deepmerge(themeOverrides, themeVariables));
	}

	return theme;
};
