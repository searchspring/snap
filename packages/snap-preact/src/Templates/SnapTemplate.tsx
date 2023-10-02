import deepmerge from 'deepmerge';
import { getDisplaySettings } from '@searchspring/snap-preact-components';

import { Snap } from '../Snap';
import { themeMap } from './themes';
import { componentMap } from './components';

import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { RecommendationInstantiatorConfigSettings, RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';
import type { ResultComponent, ResultLayoutTypes } from '@searchspring/snap-preact-components';
import type { TemplateThemeConfig } from './themes';
import type { SnapFeatures } from '../types';
import type { SnapConfig, ExtendedTarget } from '../Snap';

// // TODO: tabbing, result layout toggling, finders
type SearchTemplateConfig = {
	selector: string;
	theme?: TemplateThemeConfig;
	template: 'Search';
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
};

type AutocompleteTemplateConfig = {
	selector: string;
	theme?: TemplateThemeConfig;
	template: 'Autocomplete';
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
};

type RecommendationTemplateConfig = {
	component: string;
	theme?: TemplateThemeConfig;
	template: 'Recommendation';
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
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
		templates: [SearchTemplateConfig, ...SearchTemplateConfig[]];
		settings?: SearchStoreConfigSettings;
		breakpointSettings?: SearchStoreConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	autocomplete?: {
		inputSelector: string;
		templates: [AutocompleteTemplateConfig, ...AutocompleteTemplateConfig[]];
		settings?: AutocompleteStoreConfigSettings;
		breakpointSettings?: AutocompleteStoreConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	recommendation?: {
		templates: [RecommendationTemplateConfig, ...RecommendationTemplateConfig[]];
		settings: RecommendationInstantiatorConfigSettings;
		breakpointSettings?: RecommendationInstantiatorConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
};

export const DEFAULT_FEATURES: SnapFeatures = {
	integratedSpellCorrection: {
		enabled: true,
	},
};

export const DEFAULT_AUTOCOMPLETE_CONTROLLER_SETTINGS: AutocompleteStoreConfigSettings = {
	trending: {
		limit: 5,
	},
};

export class SnapTemplate extends Snap {
	constructor(config: SnapTemplateConfig) {
		const snapConfig = createSnapConfig(config);
		super(snapConfig);
	}
}

export function mapBreakpoints<ControllerConfigSettings>(
	breakpointsKeys: number[],
	breakpointSettings: ControllerConfigSettings[]
): { [key: string]: ControllerConfigSettings | Record<string, never> } {
	return breakpointsKeys.reduce((mapping: { [key: string]: ControllerConfigSettings | Record<string, never> }, width: number, index: number) => {
		mapping[width.toString()] = breakpointSettings[index] || {};
		return mapping;
	}, {});
}

export const createSearchTargeters = (templateConfig: SnapTemplateConfig): ExtendedTarget[] => {
	const templates = templateConfig.search?.templates || [];
	return templates.map((template) => {
		const targeter: ExtendedTarget = {
			selector: template.selector,
			theme: {
				name: template.theme?.name || templateConfig.config.theme.name,
				import: themeMap[(template.theme?.name || templateConfig.config.theme.name) as keyof typeof themeMap],
			},
			hideTarget: true,
			component: componentMap.search[template.template],
		};

		// if they are not undefined, add them
		if (template.resultComponent) {
			targeter.props = { resultComponent: template.resultComponent };
		} else if (template.resultLayout) {
			targeter.props = { resultLayout: template.resultLayout };
		}

		const variables = template.theme?.variables || templateConfig.config.theme.variables;
		if (variables && targeter.theme) targeter.theme.variables = variables;
		const overrides = template.theme?.overrides || templateConfig.config.theme.overrides;
		if (overrides && targeter.theme) targeter.theme.overrides = overrides;

		return targeter;
	});
};

export function createAutocompleteTargeters(templateConfig: SnapTemplateConfig): ExtendedTarget[] {
	const templates = templateConfig.autocomplete?.templates || [];
	return templates.map((template) => {
		const targeter: ExtendedTarget = {
			selector: template.selector,
			theme: {
				name: template.theme?.name || templateConfig.config.theme.name,
				import: themeMap[(template.theme?.name || templateConfig.config.theme.name) as keyof typeof themeMap],
			},
			component: componentMap.autocomplete[template.template],
			hideTarget: true,
		};

		// if they are not undefined, add them
		if (template.resultComponent) {
			targeter.props = { resultComponent: template.resultComponent };
		} else if (template.resultLayout) {
			targeter.props = { resultLayout: template.resultLayout };
		}
		const variables = template.theme?.variables || templateConfig.config.theme.variables;
		if (variables && targeter.theme) targeter.theme.variables = variables;
		const overrides = template.theme?.overrides || templateConfig.config.theme.overrides;
		if (overrides && targeter.theme) targeter.theme.overrides = overrides;

		return targeter;
	});
}

export function createRecommendationComponentMapping(templateConfig: SnapTemplateConfig): { [name: string]: RecommendationComponentObject } {
	const templates = templateConfig.recommendation?.templates;
	return templates
		? templates.reduce((mapping, template) => {
				mapping[template.component] = {
					theme: {
						name: template.theme?.name || templateConfig.config.theme.name,
						import: themeMap[(template.theme?.name || templateConfig.config.theme.name) as keyof typeof themeMap],
					},
					component: componentMap.recommendation[template.template],
				};

				// if they are not undefined, add them
				if (template.resultComponent) {
					mapping[template.component].props = { resultComponent: template.resultComponent };
				} else if (template.resultLayout) {
					mapping[template.component].props = { resultLayout: template.resultLayout };
				}
				const theme = mapping[template.component].theme;
				const variables = template.theme?.variables || templateConfig.config.theme.variables;
				if (variables && theme) theme.variables = variables;
				const overrides = template.theme?.overrides || templateConfig.config.theme.overrides;
				if (overrides && theme) theme.overrides = overrides;

				return mapping;
		  }, {} as { [name: string]: RecommendationComponentObject })
		: {};
}

export function createSnapConfig(templateConfig: SnapTemplateConfig): SnapConfig {
	const snapConfig: SnapConfig = {
		features: templateConfig.features || DEFAULT_FEATURES,
		client: {
			globals: {
				siteId: templateConfig.config.siteId,
			},
		},
		instantiators: {},
		controllers: {},
	};

	// add url configuration if specified
	if (templateConfig.url) {
		snapConfig.url = templateConfig.url;
	}

	/* SEARCH CONTROLLER */
	if (templateConfig.search && snapConfig.controllers) {
		const searchControllerConfig = {
			config: {
				id: 'search',
				plugins: [],
				settings: templateConfig.search.settings || {},
			},
			targeters: createSearchTargeters(templateConfig),
		};

		// merge the responsive settings if there are any
		if (templateConfig.config.theme.variables?.breakpoints && templateConfig.search.breakpointSettings) {
			const mappedBreakpoints = mapBreakpoints(templateConfig.config.theme.variables.breakpoints, templateConfig.search.breakpointSettings || []);
			const breakpointSettings = getDisplaySettings(mappedBreakpoints) as SearchStoreConfigSettings;
			searchControllerConfig.config.settings = deepmerge(searchControllerConfig.config.settings, breakpointSettings);
		}

		snapConfig.controllers.search = [searchControllerConfig];
	}

	/* AUTOCOMPLETE CONTROLLER */
	if (templateConfig.autocomplete && snapConfig.controllers) {
		const autocompleteControllerSettings: AutocompleteStoreConfigSettings = deepmerge(
			DEFAULT_AUTOCOMPLETE_CONTROLLER_SETTINGS,
			templateConfig.autocomplete.settings || {}
		);

		const autocompleteControllerConfig = {
			config: {
				id: 'autocomplete',
				plugins: [],
				selector: templateConfig.autocomplete.inputSelector,
				settings: autocompleteControllerSettings,
			},
			targeters: createAutocompleteTargeters(templateConfig),
		};

		// merge the responsive settings if there are any
		if (templateConfig.config.theme.variables?.breakpoints && templateConfig.autocomplete.breakpointSettings) {
			const mappedBreakpoints = mapBreakpoints(
				templateConfig.config.theme.variables.breakpoints,
				templateConfig.autocomplete.breakpointSettings || []
			);
			const breakpointSettings = getDisplaySettings(mappedBreakpoints) as AutocompleteStoreConfigSettings;
			autocompleteControllerConfig.config.settings = deepmerge(autocompleteControllerConfig.config.settings, breakpointSettings);
		}

		snapConfig.controllers.autocomplete = [autocompleteControllerConfig];
	}

	/* RECOMMENDATION INSTANTIATOR */
	if (templateConfig.recommendation && snapConfig.instantiators) {
		const recommendationInstantiatorConfig = {
			components: createRecommendationComponentMapping(templateConfig),
			config: templateConfig.recommendation?.settings || {},
		};

		// merge the responsive settings if there are any
		if (templateConfig.config.theme.variables?.breakpoints && templateConfig.recommendation.breakpointSettings) {
			const mappedBreakpoints = mapBreakpoints(
				templateConfig.config.theme.variables.breakpoints,
				templateConfig.recommendation.breakpointSettings || []
			);
			const breakpointSettings = getDisplaySettings(mappedBreakpoints);
			recommendationInstantiatorConfig.config = deepmerge(recommendationInstantiatorConfig.config, breakpointSettings);
		}

		snapConfig.instantiators.recommendation = recommendationInstantiatorConfig;
	}

	// return new Snap(snapConfig);
	return snapConfig;
}
