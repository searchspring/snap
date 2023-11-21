import { h, render } from 'preact';
import deepmerge from 'deepmerge';

import { Snap } from '../Snap';
import { TemplateSelect } from '@searchspring/snap-preact-components';

import { DomTargeter, url, cookies } from '@searchspring/snap-toolbox';
import { TemplatesStore } from './Stores/TemplateStore';
import type { Target } from '@searchspring/snap-toolbox';
import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { RecommendationInstantiatorConfigSettings, RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';
import type { ResultComponent, ResultLayoutTypes } from '@searchspring/snap-preact-components';
import type { SnapFeatures, DeepPartial } from '../types';
import type { SnapConfig, ExtendedTarget } from '../Snap';
import type { Theme, ThemeVariables } from '@searchspring/snap-preact-components';

export const THEME_EDIT_COOKIE = 'ssThemeEdit';
export const GLOBAL_THEME_NAME = 'global';

// // TODO: tabbing, result layout toggling, finders
export type SearchTemplateConfig = {
	selector: string;
	theme?: string;
	template: 'Search'; // various component (template) types allowed
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
};

export type AutocompleteTemplateConfig = {
	selector: string;
	theme?: string;
	template: 'Autocomplete'; // various components (templates) available
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
};

export type RecommendationTemplateConfig = {
	component: string;
	theme?: string;
	template: 'Recommendation'; // various components (templates) available
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
};

// TODO - clean up theme typing
type TemplateThemeConfig = {
	name: 'pike' | 'bocachica'; // various themes available
	variables?: DeepPartial<ThemeVariables>;
	overrides?: DeepPartial<Theme>;
};

export type SnapTemplatesConfig = {
	config: {
		siteId?: string;
		themes: {
			global: TemplateThemeConfig;
		} & { [themeName: string]: TemplateThemeConfig };
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

export class SnapTemplates extends Snap {
	constructor(config: SnapTemplatesConfig) {
		const urlParams = url(window.location.href);
		const themeEdit = Boolean(urlParams?.params?.query?.theme || cookies.get(THEME_EDIT_COOKIE));

		const templatesStore = new TemplatesStore(config, themeEdit);

		window.searchspring = window.searchspring || {};
		window.searchspring.templates = templatesStore;

		const snapConfig = createSnapConfig(config, templatesStore);
		// templatesStore.importInitialThemes(snapConfig);
		// templatesStore.init();

		super(snapConfig);

		if (themeEdit) {
			setTimeout(async () => {
				// preload the library
				await templatesStore.preLoad();

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
						const TemplateEditor = (await import('../components/TemplatesEditor')).TemplatesEditor;

						render(
							<TemplateEditor
								templatesStore={templatesStore}
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
			}, 1000);
		}
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

export const createSearchTargeters = (templateConfig: SnapTemplatesConfig, templatesStore: TemplatesStore): ExtendedTarget[] => {
	const templates = templateConfig.search?.templates || [];
	return templates.map((template) => {
		const targetId = templatesStore.addTemplate('search', template);
		const targeter: ExtendedTarget = {
			selector: template.selector,
			hideTarget: true,
			component: async () => {
				await templatesStore.library.import.component[template.template]();
				return TemplateSelect;
			},
			props: { type: 'search', templatesStore, targetId },
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

export function createAutocompleteTargeters(templateConfig: SnapTemplatesConfig, templatesStore: TemplatesStore): ExtendedTarget[] {
	const templates = templateConfig.autocomplete?.templates || [];
	return templates.map((template) => {
		const targetId = templatesStore.addTemplate('autocomplete', template);
		const targeter: ExtendedTarget = {
			selector: template.selector,
			component: async () => {
				await templatesStore.library.import.component[template.template]();
				return TemplateSelect;
			},
			props: { type: 'autocomplete', templatesStore, targetId },
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
	templateConfig: SnapTemplatesConfig,
	templatesStore: TemplatesStore
): { [name: string]: RecommendationComponentObject } {
	const templates = templateConfig.recommendation?.templates;
	return templates
		? templates.reduce((mapping, template) => {
				const targetId = templatesStore.addTemplate('recommendation', template);
				mapping[template.component] = {
					component: async () => {
						await templatesStore.library.import.component[template.template]();
						return TemplateSelect;
					},
					props: { type: 'recommendation', templatesStore, targetId },
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

export function createSnapConfig(templateConfig: SnapTemplatesConfig, templatesStore: TemplatesStore): SnapConfig {
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
			targeters: createSearchTargeters(templateConfig, templatesStore),
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
			targeters: createAutocompleteTargeters(templateConfig, templatesStore),
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
			components: createRecommendationComponentMapping(templateConfig, templatesStore),
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
