import deepmerge from 'deepmerge';
import { getDisplaySettings } from '@searchspring/snap-preact-components';

import { Snap } from '../Snap';

import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { RecommendationInstantiatorConfigSettings, RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';
import type { ResultLayoutTypes } from '@searchspring/snap-preact-components';
import type { TemplateThemeConfig } from './themes';
import type { SnapFeatures } from '../types';
import type { SnapConfig } from '../Snap';
import { themeMap } from './themes';

// // TODO: tabbing, result layout toggling, finders
type SearchTemplateConfig = {
	selector: string;
	theme?: TemplateThemeConfig;
	template: 'Search';
	resultLayout?: ResultLayoutTypes;
};

type AutocompleteTemplateConfig = {
	selector: string;
	theme?: TemplateThemeConfig;
	template: 'Autocomplete';
	resultLayout?: ResultLayoutTypes;
};

type RecommendationTemplateConfig = {
	component: string;
	theme?: TemplateThemeConfig;
	template: 'Recommendation';
	resultLayout?: ResultLayoutTypes;
};

export type SnapTemplateConfig = {
	config: {
		siteId?: string;
		theme: TemplateThemeConfig;
		currency: string;
		language: string;
	};
	url?: UrlTranslatorConfig;
	features?: SnapFeatures;
	search?: {
		templates: SearchTemplateConfig[];
		settings?: SearchStoreConfigSettings & { breakpoints?: SearchStoreConfigSettings[] };
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	autocomplete?: {
		inputSelector?: string;
		templates: AutocompleteTemplateConfig[];
		settings?: AutocompleteStoreConfigSettings & { breakpoints?: AutocompleteStoreConfigSettings[] };
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	recommendation?: {
		templates: RecommendationTemplateConfig[];
		settings: RecommendationInstantiatorConfigSettings & { breakpoints?: RecommendationInstantiatorConfigSettings[] };
		// settings?: RecommendationStoreConfigSettings & { breakpoints?: RecommendationStoreConfigSettings[] },
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
};

export class SnapTemplate extends Snap {
	constructor(config: SnapTemplateConfig) {
		const snapConfig = createSnapConfig(config);
		super(snapConfig);
	}
}

// allowed template components for each main type
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

export const createSearchTargeters = (templateConfig: SnapTemplateConfig) => {
	const templates = templateConfig.search?.templates || [];
	return templates.map((template) => {
		return {
			selector: template.selector,
			theme: {
				import: themeMap[(template.theme?.name || templateConfig.config.theme.name) as keyof typeof themeMap],
				variables: template.theme?.variables || templateConfig.config.theme.variables,
				overrides: template.theme?.overrides || templateConfig.config.theme.overrides,
			},
			props: {
				resultLayout: template.resultLayout,
			},
			hideTarget: true,
			component: componentMap.search[template.template],
		};
	});
};

export function createAutocompleteTargeters(templateConfig: SnapTemplateConfig) {
	const templates = templateConfig.autocomplete?.templates || [];
	return templates.map((template) => {
		return {
			selector: template.selector,
			theme: {
				import: themeMap[(template.theme?.name || templateConfig.config.theme.name) as keyof typeof themeMap],
				variables: template.theme?.variables || templateConfig.config.theme.variables,
				overrides: template.theme?.overrides || templateConfig.config.theme.overrides,
			},
			props: {
				resultLayout: template.resultLayout,
			},
			hideTarget: true,
			component: componentMap.autocomplete[template.template],
		};
	});
}

export function createRecommendationComponentMapping(templateConfig: SnapTemplateConfig): { [name: string]: RecommendationComponentObject } {
	const templates = templateConfig.recommendation?.templates || [];
	return templates.reduce((mapping, template) => {
		mapping[template.component] = {
			component: componentMap.recommendation[template.template],
			theme: {
				import: themeMap[(template.theme?.name || templateConfig.config.theme.name) as keyof typeof themeMap],
				variables: template.theme?.variables || templateConfig.config.theme.variables,
				overrides: template.theme?.overrides || templateConfig.config.theme.overrides,
			},
			props: {
				resultLayout: template.resultLayout,
			},
		};
		return mapping;
	}, {} as { [name: string]: RecommendationComponentObject });
}

export function createSnapConfig(templateConfig: SnapTemplateConfig): SnapConfig {
	const snapConfig: SnapConfig = {
		features: templateConfig.features,
		url: templateConfig.url,
		client: {
			globals: {
				siteId: templateConfig.config.siteId,
			},
		},
		instantiators: {},
		controllers: {},
	};

	// add search controller
	if (templateConfig.search && snapConfig.controllers) {
		snapConfig.controllers.search = [
			{
				config: {
					id: 'search',
					plugins: [],
					settings: deepmerge(
						templateConfig.search.settings || {},
						templateConfig.config.theme.variables?.breakpoints && templateConfig.search.settings?.breakpoints
							? getDisplaySettings(
									mapBreakpoints(templateConfig.config.theme.variables.breakpoints, templateConfig.search.settings.breakpoints || [])
							  )
							: {} || {}
					),
				},
				targeters: createSearchTargeters(templateConfig),
			},
		];
	}

	// add autocomplete controller
	if (templateConfig.autocomplete && snapConfig.controllers) {
		snapConfig.controllers.autocomplete = [
			{
				config: {
					id: 'autocomplete',
					selector: templateConfig.autocomplete.inputSelector || 'input.searchspring-ac',
					settings: deepmerge(
						deepmerge(
							{
								trending: {
									limit: 5,
								},
							},
							templateConfig.autocomplete.settings || {}
						),
						templateConfig.config.theme.variables?.breakpoints && templateConfig.autocomplete.settings?.breakpoints
							? getDisplaySettings(
									mapBreakpoints(templateConfig.config.theme.variables.breakpoints, templateConfig.autocomplete.settings.breakpoints || [])
							  )
							: {} || {}
					),
				},
				targeters: createAutocompleteTargeters(templateConfig),
			},
		];
	}

	// add recommendation instantiator
	if (templateConfig.recommendation && snapConfig.instantiators) {
		snapConfig.instantiators.recommendation = {
			components: createRecommendationComponentMapping(templateConfig),
			config: deepmerge(
				templateConfig.recommendation?.settings || {},
				templateConfig.config.theme.variables?.breakpoints && templateConfig.recommendation.settings?.breakpoints
					? getDisplaySettings(
							mapBreakpoints(templateConfig.config.theme.variables.breakpoints, templateConfig.recommendation.settings.breakpoints || [])
					  )
					: {} || {}
			),
		};
	}

	// return new Snap(snapConfig);
	return snapConfig;
}
