import deepmerge from 'deepmerge';
import { getDisplaySettings } from '@searchspring/snap-preact-components';

import { Snap } from '../Snap';

import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { RecommendationInstantiatorConfigSettings, RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';
import type { LayoutTypes } from '@searchspring/snap-preact-components';
import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';

import type { SnapFeatures } from '../types';
import type { SnapConfig } from '../Snap';

// // TODO: tabbing, layout toggling, finders
type SearchTemplateLayout = {
	selector: string;
	theme?: any;
	layout?: LayoutTypes<SearchController>;
	breakpoints?: (LayoutTypes<SearchController> | undefined)[];
};

type AutocompleteTemplateLayout = {
	selector: string;
	theme?: any;
	layout?: LayoutTypes<AutocompleteController>;
	breakpoints?: (LayoutTypes<AutocompleteController> | undefined)[];
};

type RecommendationTemplateLayout = {
	component: string;
	theme?: any;
	layout?: LayoutTypes<RecommendationController>;
	breakpoints?: (LayoutTypes<RecommendationController> | undefined)[];
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
				layout: layout.layout,
				breakpoints: layoutConfig.config.breakpoints
					? mapBreakpoints(
							layoutConfig.config.breakpoints,
							(layout.breakpoints || []).map((lb) => () => lb)
					  )
					: undefined,
			},
			hideTarget: true,
			component: async () => {
				return (await import('./rootComponents')).SearchLayout;
			},
		};
	});
};

export function createAutocompleteTargeters(config: SnapLayoutConfig) {
	const layouts = config.autocomplete?.layouts || [];
	return layouts.map((layout) => {
		return {
			selector: layout.selector,
			props: {
				theme: layout.theme || config.config.theme,
				layout: layout.layout,
				breakpoints: config.config.breakpoints
					? mapBreakpoints(
							config.config.breakpoints,
							(layout.breakpoints || []).map((lb) => () => lb)
					  )
					: undefined,
			},
			hideTarget: true,
			component: async () => {
				return (await import('./rootComponents')).AutocompleteLayout;
			},
		};
	});
}

export function createRecommendationComponentMapping(config: SnapLayoutConfig): { [name: string]: RecommendationComponentObject } {
	const layouts = config.recommendation?.layouts || [];
	return layouts.reduce((mapping, layout) => {
		mapping[layout.component] = {
			component: async () => {
				return (await import('./rootComponents')).RecommendationLayout;
			},
			props: {
				theme: layout.theme || config.config.theme,
				layout: layout.layout,
				breakpoints: config.config.breakpoints
					? mapBreakpoints(
							config.config.breakpoints,
							(layout.breakpoints || []).map((lb) => () => lb)
					  )
					: undefined,
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