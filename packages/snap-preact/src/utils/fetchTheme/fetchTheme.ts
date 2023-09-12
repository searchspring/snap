import type { Theme } from '@searchspring/snap-preact-components';
import type { SnapThemeConfig } from '../../Templates/themes';
import deepmerge from 'deepmerge';

export async function fetchTheme(themeConfig: SnapThemeConfig): Promise<Theme> {
	let theme: Theme = {};

	const themeImport = themeConfig.import;
	// dynamically import the theme
	theme = await themeImport();

	// merge specified theme variables with the theme
	theme = combineThemeConfig(theme, themeConfig);

	return theme;
}

function combineThemeConfig(theme: Theme, config: SnapThemeConfig) {
	const themeVariables = config?.variables || {};
	const themeOverrides = config?.overrides || {};

	return deepmerge(theme, deepmerge(themeOverrides, { variables: themeVariables }, { arrayMerge: combineMerge }), { arrayMerge: combineMerge });
}

function combineMerge(target: any, source: any, options: any) {
	const destination = target.slice();

	source.forEach((item: any, index: any) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
		} else if (options.isMergeableObject(item)) {
			destination[index] = deepmerge(target[index], item, options);
		} else if (target.indexOf(item) === -1) {
			destination[index] = item;
		}
	});

	return destination;
}
