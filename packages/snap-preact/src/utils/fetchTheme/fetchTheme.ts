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

		const combineMerge = (target: any, source: any, options: any) => {
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
		};

		theme = deepmerge(theme, deepmerge(themeOverrides, themeVariables, { arrayMerge: combineMerge }), { arrayMerge: combineMerge });
	}

	return theme;
};
