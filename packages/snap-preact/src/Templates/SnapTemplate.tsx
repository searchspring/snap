import { h, render } from 'preact';
import deepmerge from 'deepmerge';

import { Snap } from '../Snap';
import { componentMap, TemplateSelect } from './components';

import { AppMode, DomTargeter, url, cookies } from '@searchspring/snap-toolbox';
import { TemplateStore } from './Stores/TemplateStore';
import type { Target } from '@searchspring/snap-toolbox';
import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { RecommendationInstantiatorConfigSettings, RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';
import type { ResultComponent, ResultLayoutTypes } from '@searchspring/snap-preact-components';
import type { TemplateThemeConfig } from './themes';
import type { SnapFeatures } from '../types';
import type { SnapConfig, ExtendedTarget } from '../Snap';

export const THEME_EDIT_COOKIE = 'ssThemeEdit';

// // TODO: tabbing, result layout toggling, finders
type SearchTemplateConfig = {
	selector: string;
	theme?: string;
	template: 'Search';
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
};

type AutocompleteTemplateConfig = {
	selector: string;
	theme?: string;
	template: 'Autocomplete';
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
};

type RecommendationTemplateConfig = {
	component: string;
	theme?: string;
	template: 'Recommendation';
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
};

export type SnapTemplateConfig = {
	config: {
		siteId?: string;
		themes?: {
			global: TemplateThemeConfig;
			[themeName: string]: TemplateThemeConfig;
		};
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
		const templateStore = new TemplateStore(config);
		window.searchspring = window.searchspring || {};
		window.searchspring.templateStore = templateStore;

		const snapConfig = createSnapConfig(config, templateStore);
		templateStore.importInitialThemes(snapConfig);
		super(snapConfig);

		const urlParams = url(window.location.href);
		const themeEdit = urlParams?.params?.query?.theme || cookies.get(THEME_EDIT_COOKIE);

		setTimeout(() => {
			// ?dev=1&theme=1
			if (this.mode === AppMode.development && themeEdit) {
				new DomTargeter(
					[
						{
							selector: 'body',
							inject: {
								action: 'append',
								element: () => {
									const themeEditContainer = document.createElement('div');
									themeEditContainer.id = 'searchspring-template-editor';
									return themeEditContainer;
								},
							},
						},
					],
					async (target: Target, elem: Element) => {
						const TemplateEditor = (await import('./components/TemplateEditor')).TemplateEditor;
						await templateStore.initialize();
						render(
							<TemplateEditor
								templateStore={templateStore}
								onRemoveClick={() => {
									cookies.unset(THEME_EDIT_COOKIE);
									const urlState = url(window.location.href);
									delete urlState?.params.query['theme'];

									const newUrl = urlState?.url();
									if (newUrl && newUrl != window.location.href) {
										window.location.href = newUrl;
									} else {
										window.location.reload();
									}
								}}
							/>,
							elem
						);
					}
				);
			}
		});
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

export const createSearchTargeters = (templateConfig: SnapTemplateConfig, templateStore: TemplateStore): ExtendedTarget[] => {
	const templates = templateConfig.search?.templates || [];
	return templates.map((template) => {
		const targetId = templateStore.addTemplate('search', template);
		const targeter: ExtendedTarget = {
			selector: template.selector,
			hideTarget: true,
			component: TemplateSelect,
			props: { componentMap, type: 'search', templateStore, targetId, themes: templateStore.themes, templates: templateStore.templates },
		};

		// if they are not undefined, add them
		if (template.resultComponent) {
			targeter.props!.resultComponent = template.resultComponent;
		} else if (template.resultLayout) {
			targeter.props!.resultLayout = template.resultLayout;
		}

		return targeter;
	});
};

export function createAutocompleteTargeters(templateConfig: SnapTemplateConfig, templateStore: TemplateStore): ExtendedTarget[] {
	const templates = templateConfig.autocomplete?.templates || [];
	return templates.map((template) => {
		const targetId = templateStore.addTemplate('autocomplete', template);
		const targeter: ExtendedTarget = {
			selector: template.selector,
			component: TemplateSelect,
			props: { componentMap, type: 'autocomplete', templateStore, targetId, themes: templateStore.themes, templates: templateStore.templates },
			hideTarget: true,
		};

		// if they are not undefined, add them
		if (template.resultComponent) {
			targeter.props!.resultComponent = template.resultComponent;
		} else if (template.resultLayout) {
			targeter.props!.resultLayout = template.resultLayout;
		}

		return targeter;
	});
}

export function createRecommendationComponentMapping(
	templateConfig: SnapTemplateConfig,
	templateStore: TemplateStore
): { [name: string]: RecommendationComponentObject } {
	const templates = templateConfig.recommendation?.templates;
	return templates
		? templates.reduce((mapping, template) => {
				const targetId = templateStore.addTemplate('recommendation', template);
				mapping[template.component] = {
					component: TemplateSelect,
					props: { componentMap, type: 'recommendation', templateStore, targetId, themes: templateStore.themes, templates: templateStore.templates },
				};

				// if they are not undefined, add them
				if (template.resultComponent) {
					mapping[template.component].props!.resultComponent = template.resultComponent;
				} else if (template.resultLayout) {
					mapping[template.component].props!.resultLayout = template.resultLayout;
				}

				return mapping;
		  }, {} as { [name: string]: RecommendationComponentObject })
		: {};
}

export function createSnapConfig(templateConfig: SnapTemplateConfig, templateStore: TemplateStore): SnapConfig {
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
			targeters: createSearchTargeters(templateConfig, templateStore),
		};

		// merge the responsive settings if there are any
		// if (templateConfig.config.theme.variables?.breakpoints && templateConfig.search.breakpointSettings) {
		// 	const mappedBreakpoints = mapBreakpoints(templateConfig.config.theme.variables.breakpoints, templateConfig.search.breakpointSettings || []);
		// 	const breakpointSettings = getDisplaySettings(mappedBreakpoints) as SearchStoreConfigSettings;
		// 	searchControllerConfig.config.settings = deepmerge(searchControllerConfig.config.settings, breakpointSettings);
		// }

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
			targeters: createAutocompleteTargeters(templateConfig, templateStore),
		};

		// merge the responsive settings if there are any
		// if (templateConfig.config.theme.variables?.breakpoints && templateConfig.autocomplete.breakpointSettings) {
		// 	const mappedBreakpoints = mapBreakpoints(
		// 		templateConfig.config.theme.variables.breakpoints,
		// 		templateConfig.autocomplete.breakpointSettings || []
		// 	);
		// 	const breakpointSettings = getDisplaySettings(mappedBreakpoints) as AutocompleteStoreConfigSettings;
		// 	autocompleteControllerConfig.config.settings = deepmerge(autocompleteControllerConfig.config.settings, breakpointSettings);
		// }

		snapConfig.controllers.autocomplete = [autocompleteControllerConfig];
	}

	/* RECOMMENDATION INSTANTIATOR */
	if (templateConfig.recommendation && snapConfig.instantiators) {
		const recommendationInstantiatorConfig = {
			components: createRecommendationComponentMapping(templateConfig, templateStore),
			config: templateConfig.recommendation?.settings || {},
		};

		// merge the responsive settings if there are any
		// if (templateConfig.config.theme.variables?.breakpoints && templateConfig.recommendation.breakpointSettings) {
		// 	const mappedBreakpoints = mapBreakpoints(
		// 		templateConfig.config.theme.variables.breakpoints,
		// 		templateConfig.recommendation.breakpointSettings || []
		// 	);
		// 	const breakpointSettings = getDisplaySettings(mappedBreakpoints);
		// 	recommendationInstantiatorConfig.config = deepmerge(recommendationInstantiatorConfig.config, breakpointSettings);
		// }

		snapConfig.instantiators.recommendation = recommendationInstantiatorConfig;
	}

	// return new Snap(snapConfig);
	return snapConfig;
}
