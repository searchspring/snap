import deepmerge from 'deepmerge';
import { getDisplaySettings } from '@searchspring/snap-preact-components';

import { Snap } from '../Snap';

import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { RecommendationInstantiatorConfigSettings, RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';
import type { ResultLayoutTypes } from '@searchspring/snap-preact-components';
import type { SnapFeatures } from '../types';
import type { SnapConfig } from '../Snap';

// // TODO: tabbing, layout toggling, finders
type SearchTemplateLayout = {
	selector: string;
	theme?: any;
	template: 'Search';
	resultLayout?: ResultLayoutTypes;
};

type AutocompleteTemplateLayout = {
	selector: string;
	theme?: any;
	template: 'Autocomplete';
	resultLayout?: ResultLayoutTypes;
};

type RecommendationTemplateLayout = {
	component: string;
	theme?: any;
	template: 'Recommendation';
	resultLayout?: ResultLayoutTypes;
};

export type SnapLayoutConfig = {
	config: {
		siteId?: string;
		theme?: any;
		currency: string;
		language: string;
		breakpoints?: number[];
	};
	url?: UrlTranslatorConfig;
	features?: SnapFeatures;
	search?: {
		layouts: SearchTemplateLayout[];
		settings?: SearchStoreConfigSettings & { breakpoints?: SearchStoreConfigSettings[] };
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	autocomplete?: {
		inputSelector?: string;
		layouts: AutocompleteTemplateLayout[];
		settings?: AutocompleteStoreConfigSettings & { breakpoints?: AutocompleteStoreConfigSettings[] };
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	recommendation?: {
		layouts: RecommendationTemplateLayout[];
		settings: RecommendationInstantiatorConfigSettings & { breakpoints?: RecommendationInstantiatorConfigSettings[] };
		// settings?: RecommendationStoreConfigSettings & { breakpoints?: RecommendationStoreConfigSettings[] },
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
};

export class SnapLayout extends Snap {
	constructor(config: SnapLayoutConfig) {
		const snapConfig = createSnapConfig(config);
		super(snapConfig);
	}
}

// components that can be used and that support resultLayout
const componentMap = {
	search: {
		Search: async () => {
			return (await import('./components/search')).Search;
		},
	},
	autocomplete: {
		Autocomplete: async () => {
			return (await import('./components/autocomplete')).Autocomplete;
		},
	},
	recommendation: {
		Recommendation: async () => {
			return (await import('./components/recommendation')).Recommendation;
		},
	},
};

export function mapBreakpoints(breakpointsKeys: number[], breakpointSettings: unknown[]): { [key: number]: any } {
	return breakpointsKeys.reduce((mapping: any, width: number, index: number) => {
		mapping[width] = breakpointSettings[index];
		return mapping;
	}, {});
}

export const createSearchTargeters = (layoutConfig: SnapLayoutConfig) => {
	const layouts = layoutConfig.search?.layouts || [];
	return layouts.map((layout) => {
		return {
			selector: layout.selector,
			props: {
				theme: layout.theme || layoutConfig.config.theme,
				// breakpoints: layoutConfig.config.breakpoints,
				resultLayout: layout.resultLayout,
			},
			hideTarget: true,
			component: componentMap.search[layout.template],
		};
	});
};

export function createAutocompleteTargeters(layoutConfig: SnapLayoutConfig) {
	const layouts = layoutConfig.autocomplete?.layouts || [];
	return layouts.map((layout) => {
		return {
			selector: layout.selector,
			props: {
				theme: layout.theme || layoutConfig.config.theme,
				// breakpoints: layoutConfig.config.breakpoints,
				resultLayout: layout.resultLayout,
			},
			hideTarget: true,
			component: componentMap.autocomplete[layout.template],
		};
	});
}

export function createRecommendationComponentMapping(layoutConfig: SnapLayoutConfig): { [name: string]: RecommendationComponentObject } {
	const layouts = layoutConfig.recommendation?.layouts || [];
	return layouts.reduce((mapping, layout) => {
		mapping[layout.component] = {
			component: componentMap.recommendation[layout.template],
			props: {
				theme: layout.theme || layoutConfig.config.theme,
				// breakpoints: layoutConfig.config.breakpoints,
				resultLayout: layout.resultLayout,
			},
		};
		return mapping;
	}, {} as { [name: string]: RecommendationComponentObject });
}

export function createSnapConfig(layoutConfig: SnapLayoutConfig): SnapConfig {
	const snapConfig: SnapConfig = {
		features: layoutConfig.features,
		url: layoutConfig.url,
		client: {
			globals: {
				siteId: layoutConfig.config.siteId,
			},
		},
		instantiators: {},
		controllers: {},
	};

	// add search controller
	if (layoutConfig.search && snapConfig.controllers) {
		snapConfig.controllers.search = [
			{
				config: {
					id: 'search',
					plugins: [],
					settings: deepmerge(
						layoutConfig.search.settings || {},
						layoutConfig.config.breakpoints && layoutConfig.search.settings?.breakpoints
							? getDisplaySettings(mapBreakpoints(layoutConfig.config.breakpoints, layoutConfig.search.settings.breakpoints || []))
							: {} || {}
					),
				},
				targeters: createSearchTargeters(layoutConfig),
			},
		];
	}

	// add autocomplete controller
	if (layoutConfig.autocomplete && snapConfig.controllers) {
		snapConfig.controllers.autocomplete = [
			{
				config: {
					id: 'autocomplete',
					selector: layoutConfig.autocomplete.inputSelector || 'input.searchspring-ac',
					settings: deepmerge(
						deepmerge(
							{
								trending: {
									limit: 5,
								},
							},
							layoutConfig.autocomplete.settings || {}
						),
						layoutConfig.config.breakpoints && layoutConfig.autocomplete.settings?.breakpoints
							? getDisplaySettings(mapBreakpoints(layoutConfig.config.breakpoints, layoutConfig.autocomplete.settings.breakpoints || []))
							: {} || {}
					),
				},
				targeters: createAutocompleteTargeters(layoutConfig),
			},
		];
	}

	// add recommendation instantiator
	if (layoutConfig.recommendation && snapConfig.instantiators) {
		snapConfig.instantiators.recommendation = {
			components: createRecommendationComponentMapping(layoutConfig),
			config: deepmerge(
				layoutConfig.recommendation?.settings || {},
				layoutConfig.config.breakpoints && layoutConfig.recommendation.settings?.breakpoints
					? getDisplaySettings(mapBreakpoints(layoutConfig.config.breakpoints, layoutConfig.recommendation.settings.breakpoints || []))
					: {} || {}
			),
		};
	}

	// return new Snap(snapConfig);
	return snapConfig;
}
