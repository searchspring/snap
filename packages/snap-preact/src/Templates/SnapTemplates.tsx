import { h, render } from 'preact';
import deepmerge from 'deepmerge';

import { Snap } from '../Snap';
import { TemplateSelect } from '../../components/src';

import { DomTargeter, url, cookies, getContext } from '@searchspring/snap-toolbox';
import { TemplateTarget, TemplatesStore } from './Stores/TemplateStore';

import type { Target } from '@searchspring/snap-toolbox';
import type { SearchStoreConfigSettings, AutocompleteStoreConfigSettings } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { PluginGrouping } from '@searchspring/snap-controller';
import type {
	RecommendationInstantiatorConfigSettings,
	RecommendationComponentObject,
	RecommendationInstantiatorConfig,
} from '../Instantiators/RecommendationInstantiator';
import type { SnapFeatures } from '../types';
import type { SnapConfig, ExtendedTarget } from '../Snap';
import type { RecsTemplateTypes, TemplatesStoreConfigConfig, TemplateTypes } from './Stores/TemplateStore';
import { LibraryImports } from './Stores/LibraryStore';
import { GLOBAL_THEME_NAME } from './Stores/TargetStore';
import type {
	CommonPluginBackgroundFilterConfig,
	pluginBackgroundFilters,
	pluginScrollToTop,
	CommonPluginScrollToTopConfig,
	pluginLogger,
} from '@searchspring/snap-platforms/common';
import type { pluginBackgroundFilters as shopifyPluginBackgroundFilters } from '@searchspring/snap-platforms/shopify';
import { pluginMutateResults as shopifyPluginMutateResults, ShopifyPluginMutateResultsConfig } from '@searchspring/snap-platforms/shopify';
import type { pluginBackgroundFilters as bigCommercePluginBackgroundFilters } from '@searchspring/snap-platforms/bigcommerce';
import type { pluginBackgroundFilters as magento2PluginBackgroundFilters } from '@searchspring/snap-platforms/magento2';

export const THEME_EDIT_COOKIE = 'ssThemeEdit';

// TODO: tabbing, finder
export type SearchTargetConfig = {
	selector: string;
	theme?: keyof LibraryImports['theme'] | (string & NonNullable<unknown>);
	component: keyof LibraryImports['component']['search'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};

export type AutocompleteTargetConfig = {
	selector: string;
	theme?: keyof LibraryImports['theme'] | (string & NonNullable<unknown>);
	component: keyof LibraryImports['component']['autocomplete'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};

export type RecommendationDefaultTargetConfig = {
	theme?: keyof LibraryImports['theme'] | (string & NonNullable<unknown>);
	component: keyof LibraryImports['component']['recommendation']['default'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};
export type RecommendationEmailTargetConfig = {
	theme?: keyof LibraryImports['theme'] | (string & NonNullable<unknown>);
	component: keyof LibraryImports['component']['recommendation']['email'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};
export type RecommendationBundleTargetConfig = {
	theme?: keyof LibraryImports['theme'] | (string & NonNullable<unknown>);
	component: keyof LibraryImports['component']['recommendation']['bundle'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};

export type SnapTemplatesConfig = TemplatesStoreConfigConfig & {
	url?: UrlTranslatorConfig;
	features?: SnapFeatures;
	search?: {
		targets: [SearchTargetConfig, ...SearchTargetConfig[]];
		settings?: SearchStoreConfigSettings;
		// breakpointSettings?: SearchStoreConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	autocomplete?: {
		inputSelector: string;
		targets: [AutocompleteTargetConfig, ...AutocompleteTargetConfig[]];
		settings?: AutocompleteStoreConfigSettings;
		// breakpointSettings?: AutocompleteStoreConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	recommendation?: {
		email?: {
			[profileComponentName: string]: RecommendationEmailTargetConfig;
		};
		default?: {
			[profileComponentName: string]: RecommendationDefaultTargetConfig;
		};
		bundle?: {
			[profileComponentName: string]: RecommendationBundleTargetConfig;
		};
		settings?: RecommendationInstantiatorConfigSettings;
		// breakpointSettings?: RecommendationInstantiatorConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
};

type TemplatePlugins =
	// common
	| [typeof pluginBackgroundFilters, CommonPluginBackgroundFilterConfig]
	| [typeof pluginScrollToTop, CommonPluginScrollToTopConfig]
	| [typeof pluginLogger]
	// shopify
	| [typeof shopifyPluginBackgroundFilters]
	| [typeof shopifyPluginMutateResults, ShopifyPluginMutateResultsConfig]
	// bigCommerce
	| [typeof bigCommercePluginBackgroundFilters]
	// magento2
	| [typeof magento2PluginBackgroundFilters];

type TemplatePluginGrouping = TemplatePlugins[];

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
	templates: TemplatesStore;
	constructor(config: SnapTemplatesConfig) {
		const urlParams = url(window.location.href);
		const editMode = Boolean(urlParams?.params?.query?.theme || cookies.get(THEME_EDIT_COOKIE));

		const templatesStore = new TemplatesStore({ config, settings: { editMode } });

		const snapConfig = createSnapConfig(config, templatesStore);

		// get more context (all the things needed for the platform of choice as well as generic backgroundFilters)
		let contextParams = ['backgroundFilters'];
		switch (templatesStore.platform) {
			case 'shopify':
				contextParams = contextParams.concat(['collection', 'tags']);
				break;
			case 'bigCommerce':
				contextParams = contextParams.concat(['category', 'brand']);
				break;
			case 'magento2':
				contextParams = contextParams.concat(['category']);
				break;
			default:
				break;
		}
		snapConfig.context = getContext(contextParams);

		super(snapConfig, { templatesStore });

		this.templates = templatesStore;

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
						const TemplateEditor = (await import('../../components/src')).TemplatesEditor;

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
		// use theme provided resultComponent if specified
		if (!target.resultComponent && templateConfig.themes[target.theme || GLOBAL_THEME_NAME].resultComponent) {
			target.resultComponent = templateConfig.themes[target.theme || GLOBAL_THEME_NAME].resultComponent;
		}
		const targetId = templatesStore.addTarget('search', target);
		const targeter: ExtendedTarget = {
			selector: target.selector,
			hideTarget: true,
			component: async () => {
				const componentImportPromises = [];
				componentImportPromises.push(templatesStore.library.import.component.search[target.component]());
				if (target.resultComponent && templatesStore.library.import.component.result[target.resultComponent]) {
					componentImportPromises.push(templatesStore.library.import.component.result[target.resultComponent]());
				}
				await Promise.all(componentImportPromises);
				return TemplateSelect;
			},
			props: { type: 'search', templatesStore, targetId },
		};

		return targeter;
	});
};

export function createAutocompleteTargeters(templateConfig: SnapTemplatesConfig, templatesStore: TemplatesStore): ExtendedTarget[] {
	const targets = templateConfig.autocomplete?.targets || [];
	return targets.map((target) => {
		// use theme provided resultComponent if specified
		if (!target.resultComponent && templateConfig.themes[target.theme || GLOBAL_THEME_NAME].resultComponent) {
			target.resultComponent = templateConfig.themes[target.theme || GLOBAL_THEME_NAME].resultComponent;
		}

		const targetId = templatesStore.addTarget('autocomplete', target);
		const targeter: ExtendedTarget = {
			selector: target.selector,
			component: async () => {
				const componentImportPromises = [];
				componentImportPromises.push(templatesStore.library.import.component.autocomplete[target.component]());
				if (target.resultComponent && templatesStore.library.import.component.result[target.resultComponent]) {
					componentImportPromises.push(templatesStore.library.import.component.result[target.resultComponent]());
				}
				await Promise.all(componentImportPromises);
				return TemplateSelect;
			},
			props: { type: 'autocomplete', templatesStore, targetId, input: templateConfig.autocomplete?.inputSelector },
			hideTarget: true,
		};

		return targeter;
	});
}

export function createRecommendationComponentMapping(
	templateConfig: SnapTemplatesConfig,
	templatesStore: TemplatesStore
): { [name: string]: RecommendationComponentObject } {
	// TODO: throw a warning if keys match inside each recommendation type

	return Object.keys(templateConfig.recommendation || {})
		.filter((key) => ['default', 'email', 'bundle'].includes(key))
		.reduce((mapping, type) => {
			const recsType = type as RecsTemplateTypes;
			Object.keys(templateConfig.recommendation![recsType] || {}).forEach((targetName) => {
				const type: TemplateTypes = `recommendation/${recsType}`;
				const target = templateConfig.recommendation![recsType]![targetName] as TemplateTarget;

				// use theme provided resultComponent if specified
				if (!target.resultComponent && templateConfig.themes[target.theme || GLOBAL_THEME_NAME].resultComponent) {
					target.resultComponent = templateConfig.themes[target.theme || GLOBAL_THEME_NAME].resultComponent;
				}

				const mappedConfig: RecommendationComponentObject = {
					component: async () => {
						const componentImportPromises = [];
						switch (recsType) {
							case 'default': {
								const importLocation = templatesStore.library.import.component.recommendation.default;
								componentImportPromises.push(importLocation[target.component as keyof typeof importLocation]());
								break;
							}
							case 'bundle': {
								const importLocation = templatesStore.library.import.component.recommendation.bundle;
								componentImportPromises.push(importLocation[target.component as keyof typeof importLocation]());
								break;
							}
							case 'email': {
								const importLocation = templatesStore.library.import.component.recommendation.email;
								componentImportPromises.push(importLocation[target.component as keyof typeof importLocation]());
								break;
							}
						}
						if (target.resultComponent && templatesStore.library.import.component.result[target.resultComponent]) {
							componentImportPromises.push(templatesStore.library.import.component.result[target.resultComponent]());
						}
						await Promise.all(componentImportPromises);
						return TemplateSelect;
					},
					props: { type, templatesStore },
					onTarget: function (domTarget, elem, injectedElem, controller) {
						target.selector = `#${controller.id}`;
						const targetId = templatesStore.addTarget(type, target);

						this.props = this.props || {};
						this.props.targetId = targetId;
					},
				};
				mapping[targetName] = mappedConfig;
			});
			return mapping;
		}, {} as { [name: string]: RecommendationComponentObject });
}

export function createSnapConfig(templateConfig: SnapTemplatesConfig, templatesStore: TemplatesStore): SnapConfig {
	const snapConfig: SnapConfig = {
		features: templateConfig.features || DEFAULT_FEATURES,
		client: {
			globals: {
				siteId: templateConfig.config?.siteId,
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
				plugins: createPlugins(templateConfig, templatesStore),
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
				plugins: createPlugins(templateConfig, templatesStore),
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
	const originalRecsConfig = templateConfig.recommendation || {};
	templateConfig.recommendation = deepmerge(
		{
			settings: {
				branch: 'production',
			},
			bundle: {
				Bundle: {
					component: 'RecommendationBundle',
				},
				BundleEasyAdd: {
					component: 'RecommendationBundleEasyAdd',
				},
				BundleList: {
					component: 'RecommendationBundleList',
				},
				BundleVertical: {
					component: 'RecommendationBundleVertical',
				},
			},
			default: {
				Default: {
					component: 'Recommendation',
				},
			},
			email: {
				Email: {
					component: 'RecommendationEmail',
				},
			},
		},
		originalRecsConfig
	) as SnapTemplatesConfig['recommendation'];
	if (templateConfig.recommendation && snapConfig.instantiators) {
		const recommendationInstantiatorConfig: RecommendationInstantiatorConfig = {
			components: createRecommendationComponentMapping(templateConfig, templatesStore),
			config: {
				plugins: createPlugins(templateConfig, templatesStore),
				...templateConfig.recommendation?.settings!,
			},
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

	return snapConfig;
}

function createPlugins(templateConfig: SnapTemplatesConfig, templatesStore: TemplatesStore): PluginGrouping[] {
	const plugins: TemplatePluginGrouping = [];

	plugins.push([
		templatesStore.library.import.plugins.common.backgroundFilters,
		templateConfig.plugins?.common?.backgroundFilters || { filters: [] },
	]);
	plugins.push([templatesStore.library.import.plugins.common.scrollToTop, templateConfig.plugins?.common?.scrollToTop || { enabled: true }]);
	plugins.push([templatesStore.library.import.plugins.common.logger]);

	switch (templatesStore.platform) {
		case 'shopify':
			plugins.push([templatesStore.library.import.plugins.shopify.backgroundFilters]);
			plugins.push([
				templatesStore.library.import.plugins.shopify.mutateResults,
				templateConfig.plugins?.shopify?.mutateResults || { collectionInUrl: { enabled: true } },
			]);
			break;
		case 'bigCommerce':
			plugins.push([templatesStore.library.import.plugins.bigcommerce.backgroundFilters]);
			break;
		case 'magento2':
			plugins.push([templatesStore.library.import.plugins.magento2.backgroundFilters]);
			break;
		default:
			break;
	}

	return plugins as PluginGrouping[];
}
