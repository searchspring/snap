import deepmerge from 'deepmerge';
import {
	AutocompleteLayoutElement,
	SearchLayoutElement,
	AutocompleteLayoutFunc,
	SearchLayoutFunc,
	getDisplaySettings,
} from '@searchspring/snap-preact-components';

import { Snap } from '../Snap';

import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { RecommendationLayoutFunc } from '@searchspring/snap-preact-components';
import type { RecommendationLayoutElement } from '@searchspring/snap-preact-components';
import type { RecommendationInstantiatorConfigSettings, RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';

import type { SnapFeatures } from '../types';
import type { SnapConfig } from '../Snap';

// // TODO: tabbing, layout toggling, finders
type SearchTemplateLayout = {
	selector: string;
	style?: string | Record<string, string>;
	breakpoints: (SearchLayoutFunc | SearchLayoutElement | undefined)[];
};

type AutocompleteTemplateLayout = {
	selector: string;
	style?: string | Record<string, string>;
	breakpoints: (AutocompleteLayoutFunc | AutocompleteLayoutElement | undefined)[];
};

type RecommendationTemplateLayout = {
	component: string;
	style?: string | Record<string, string>;
	breakpoints: (RecommendationLayoutFunc | RecommendationLayoutElement | undefined)[];
};

export type SnapLayoutConfig = {
	platform: 'magento' | 'bigcommerce' | 'shopify' | 'custom';
	siteId: string;
	locale?: any;
	ui?: any;
	layout: {
		breakpoints: number[];
	};
	url?: UrlTranslatorConfig;
	features?: SnapFeatures;
	search: {
		layouts: SearchTemplateLayout[];
		settings?: SearchStoreConfigSettings & { breakpoints?: SearchStoreConfigSettings[] };
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	autocomplete: {
		inputSelector?: string;
		layouts: AutocompleteTemplateLayout[];
		settings?: AutocompleteStoreConfigSettings & { breakpoints?: AutocompleteStoreConfigSettings[] };
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	recommendation: {
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

export function mapBreakpoints(breakpointsKeys: number[], breakpointSettings: unknown[]): { [key: number]: any } {
	return breakpointsKeys.reduce((mapping: any, width: number, index: number) => {
		mapping[width] = breakpointSettings[index];
		return mapping;
	}, {});
}

export const createSearchTargeters = (config: SnapLayoutConfig) => {
	const layouts = config.search.layouts || [];

	return layouts.map((layout) => {
		return {
			selector: layout.selector,
			props: {
				style: layout.style,
				breakpoints: mapBreakpoints(
					config.layout.breakpoints,
					layout.breakpoints.map((lb) => () => lb)
				),
			},
			hideTarget: true,
			component: async () => {
				return (await import('./rootComponents')).SearchLayout;
			},
		};
	});
};

export function createAutocompleteTargeters(config: SnapLayoutConfig) {
	const layouts = config.autocomplete.layouts || [];
	return layouts.map((layout) => {
		return {
			selector: layout.selector,
			props: {
				style: layout.style,
				breakpoints: mapBreakpoints(
					config.layout.breakpoints,
					layout.breakpoints.map((lb) => () => lb)
				),
			},
			hideTarget: true,
			component: async () => {
				return (await import('./rootComponents')).AutocompleteLayout;
			},
		};
	});
}

export function createRecommendationComponentMapping(config: SnapLayoutConfig): { [name: string]: RecommendationComponentObject } {
	const layouts = config.recommendation.layouts || [];
	return layouts.reduce((mapping, layout) => {
		mapping[layout.component] = {
			component: async () => {
				return (await import('./rootComponents')).RecommendationLayout;
			},
			props: {
				style: layout.style,
				breakpoints: mapBreakpoints(
					config.layout.breakpoints,
					layout.breakpoints.map((lb) => () => lb)
				),
			},
		};
		return mapping;
	}, {} as { [name: string]: RecommendationComponentObject });
}

export function createSnapConfig(config: SnapLayoutConfig): SnapConfig {
	const snapConfig: SnapConfig = {
		features: config.features,
		url: config.url,
		client: {
			globals: {
				siteId: config.siteId,
			},
		},
		instantiators: {
			recommendation: {
				components: createRecommendationComponentMapping(config),
				config: deepmerge(
					config.recommendation?.settings || {},
					getDisplaySettings(mapBreakpoints(config.layout.breakpoints, config.recommendation?.settings?.breakpoints || [])) || {}
				),
			},
		},
		controllers: {
			search: [
				{
					config: {
						id: 'search',
						plugins: [],
						settings: deepmerge(
							config.search.settings || {},
							getDisplaySettings(mapBreakpoints(config.layout.breakpoints, config.search.settings?.breakpoints || [])) || {}
						),
					},
					targeters: createSearchTargeters(config),
				},
			],
			autocomplete: [
				{
					config: {
						id: 'autocomplete',
						selector: config.autocomplete.inputSelector || 'input.searchspring-ac',
						settings: deepmerge(
							deepmerge(
								{
									trending: {
										limit: 5,
									},
								},
								config.autocomplete.settings || {}
							),
							getDisplaySettings(mapBreakpoints(config.layout.breakpoints, config.autocomplete.settings?.breakpoints || [])) || {}
						),
					},
					targeters: createAutocompleteTargeters(config),
				},
			],
		},
	};

	// return new Snap(snapConfig);
	return snapConfig;
}
