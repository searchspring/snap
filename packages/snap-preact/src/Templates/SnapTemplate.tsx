import { h, render } from 'preact';
import deepmerge from 'deepmerge';

import { Snap } from '../Snap';
import { TemplateSelect } from '../../components/src';

import { DomTargeter, url, cookies } from '@searchspring/snap-toolbox';
import { TemplatesStore } from './Stores/TemplateStore';
import type { Target } from '@searchspring/snap-toolbox';
import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { RecommendationInstantiatorConfigSettings, RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';
import type { ResultComponent } from '../../components/src';
import type { SnapFeatures, DeepPartial } from '../types';
import type { SnapConfig, ExtendedTarget } from '../Snap';
import type { Theme, ThemeVariables } from '../../components/src';

export const THEME_EDIT_COOKIE = 'ssThemeEdit';
export const GLOBAL_THEME_NAME = 'global';

// // TODO: tabbing, result layout toggling, finders
export type SearchTargetConfig = {
	selector: string;
	theme?: string;
	template: 'Search' | 'HorizontalSearch'; // various component (template) types allowed
	resultComponent?: ResultComponent;
};

export type AutocompleteTargetConfig = {
	selector: string;
	theme?: string;
	template: 'Autocomplete'; // various components (templates) available
	resultComponent?: ResultComponent;
};

export type RecommendationTargetConfig = {
	component: string;
	theme?: string;
	template: 'Recommendation'; // various components (templates) available
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
		targets: [SearchTargetConfig, ...SearchTargetConfig[]];
		settings?: SearchStoreConfigSettings;
		breakpointSettings?: SearchStoreConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	autocomplete?: {
		inputSelector: string;
		targets: [AutocompleteTargetConfig, ...AutocompleteTargetConfig[]];
		settings?: AutocompleteStoreConfigSettings;
		breakpointSettings?: AutocompleteStoreConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	recommendation?: {
		targets: [RecommendationTargetConfig, ...RecommendationTargetConfig[]];
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
	public templates: TemplatesStore;

	constructor(config: SnapTemplatesConfig) {
		const urlParams = url(window.location.href);
		const editMode = Boolean(urlParams?.params?.query?.theme || cookies.get(THEME_EDIT_COOKIE));

		const templatesStore = new TemplatesStore(config, { editMode });

		const snapConfig = createSnapConfig(config, templatesStore);

		super(snapConfig);
		this.templates = templatesStore;

		window.searchspring.templates = templatesStore;

		if (editMode) {
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
			});
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
	const targets = templateConfig.search?.targets || [];
	return targets.map((target) => {
		const targetId = templatesStore.addTarget('search', target);
		const targeter: ExtendedTarget = {
			selector: target.selector,
			hideTarget: true,
			component: async () => {
				await templatesStore.library.import.component[target.template]();
				return TemplateSelect;
			},
			props: { type: 'search', templatesStore, targetId },
		};

		// if they are not undefined, add them
		if (target.resultComponent) {
			targeter.props!.resultComponent = target.resultComponent;
		}

		return targeter;
	});
};

export function createAutocompleteTargeters(templateConfig: SnapTemplatesConfig, templatesStore: TemplatesStore): ExtendedTarget[] {
	const targets = templateConfig.autocomplete?.targets || [];
	return targets.map((target) => {
		const targetId = templatesStore.addTarget('autocomplete', target);
		const targeter: ExtendedTarget = {
			selector: target.selector,
			component: async () => {
				await templatesStore.library.import.component[target.template]();
				return TemplateSelect;
			},
			props: { type: 'autocomplete', templatesStore, targetId },
			hideTarget: true,
		};

		// if they are not undefined, add them
		if (target.resultComponent) {
			targeter.props!.resultComponent = target.resultComponent;
		}

		return targeter;
	});
}

export function createRecommendationComponentMapping(
	templateConfig: SnapTemplatesConfig,
	templatesStore: TemplatesStore
): { [name: string]: RecommendationComponentObject } {
	const targets = templateConfig.recommendation?.targets;
	return targets
		? targets.reduce(
				(mapping, target) => {
					const targetId = templatesStore.addTarget('recommendation', target);
					mapping[target.component] = {
						component: async () => {
							await templatesStore.library.import.component[target.template]();
							return TemplateSelect;
						},
						props: { type: 'recommendation', templatesStore, targetId },
					};

					// if they are not undefined, add them
					if (target.resultComponent) {
						mapping[target.component].props!.resultComponent = target.resultComponent;
					}

					return mapping;
				},
				{} as { [name: string]: RecommendationComponentObject }
			)
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
