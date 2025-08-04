import { h, render } from 'preact';
import deepmerge from 'deepmerge';

import { Snap } from '../Snap';
import { TemplateSelect } from '../../components/src/components/Atoms/TemplateSelect';

import { DomTargeter, url, cookies, getContext } from '@searchspring/snap-toolbox';
import { TemplateTarget, TemplatesStore } from './Stores/TemplateStore';

import type { Target } from '@searchspring/snap-toolbox';
import { type SearchStoreConfigSettings, type AutocompleteStoreConfigSettings, StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { AutocompleteController, PluginGrouping, SearchController } from '@searchspring/snap-controller';
import type {
	RecommendationInstantiatorConfigSettings,
	RecommendationComponentObject,
	RecommendationInstantiatorConfig,
} from '../Instantiators/RecommendationInstantiator';
import type { SnapFeatures } from '../types';
import type { SnapConfig, ExtendedTarget } from '../Snap';
import type { PluginsConfigs, RecsTemplateTypes, TemplatesStoreConfigConfig, TemplateTypes } from './Stores/TemplateStore';
import { LibraryImports } from './Stores/LibraryStore';
import {
	pluginBackgroundFilters,
	PluginBackgroundFiltersConfig,
	pluginScrollToTop,
	PluginScrollToTopConfig,
	pluginAddToCart,
	PluginAddToCartConfig,
	pluginLogger,
	PluginLoggerConfig,
} from '@searchspring/snap-platforms/common';
import {
	pluginBackgroundFilters as PluginShopifyBackgroundFilters,
	PluginBackgroundFiltersConfig as PluginShopifyBackgroundFiltersConfig,
	pluginMutateResults as pluginShopifyMutateResults,
	PluginMutateResultsConfig as PluginShopifyMutateResultsConfig,
	pluginAddToCart as pluginShopifyAddToCart,
	PluginAddToCartConfig as PluginShopifyAddToCartConfig,
} from '@searchspring/snap-platforms/shopify';
import {
	pluginAddToCart as pluginBigcommerceAddToCart,
	PluginAddToCartConfig as PluginBigCommerceAddToCartConfig,
	pluginBackgroundFilters as pluginBigcommerceBackgroundFilters,
	PluginBackgroundFiltersConfig as PluginBigcommerceBackgroundFiltersConfig,
} from '@searchspring/snap-platforms/bigcommerce';
import {
	pluginAddToCart as pluginMagento2AddToCart,
	AddToCartConfig as PluginMagento2AddToCartConfig,
	pluginBackgroundFilters as pluginMagento2BackgroundFilters,
	PluginBackgroundFiltersConfig as PluginMagento2BackgroundFiltersConfig,
} from '@searchspring/snap-platforms/magento2';

export const THEME_EDIT_COOKIE = 'ssThemeEdit';
const TEMPLATE_EDITOR_PARAM = 'searchspring-editor';

// TODO: tabbing, finder
export type SearchTargetConfig = {
	selector: string;
	component: keyof LibraryImports['component']['search'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};

export type AutocompleteTargetConfig = {
	selector: string;
	inputSelector?: string;
	component: keyof LibraryImports['component']['autocomplete'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};

export type RecommendationDefaultTargetConfig = {
	component: keyof LibraryImports['component']['recommendation']['default'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};
export type RecommendationEmailTargetConfig = {
	component: keyof LibraryImports['component']['recommendation']['email'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};
export type RecommendationBundleTargetConfig = {
	component: keyof LibraryImports['component']['recommendation']['bundle'];
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};

export type SnapTemplatesConfig = TemplatesStoreConfigConfig & {
	url?: UrlTranslatorConfig;
	features?: SnapFeatures;
	search?: {
		targets: [SearchTargetConfig, ...SearchTargetConfig[]];
		settings?: SearchStoreConfigSettings;
		plugins?: PluginsConfigs;
		// breakpointSettings?: SearchStoreConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
	autocomplete?: {
		targets: [AutocompleteTargetConfig, ...AutocompleteTargetConfig[]];
		settings?: AutocompleteStoreConfigSettings;
		plugins?: PluginsConfigs;
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
		plugins?: PluginsConfigs;
		// breakpointSettings?: RecommendationInstantiatorConfigSettings[];
		/* controller settings breakpoints work with caveat of having settings locked to initialized breakpoint */
	};
};

type TemplatePlugins =
	// common
	| [typeof pluginBackgroundFilters, PluginBackgroundFiltersConfig]
	| [typeof pluginScrollToTop, PluginScrollToTopConfig]
	| [typeof pluginLogger, PluginLoggerConfig]
	| [typeof pluginAddToCart, PluginAddToCartConfig]
	// shopify
	| [typeof PluginShopifyBackgroundFilters, PluginShopifyBackgroundFiltersConfig]
	| [typeof pluginShopifyMutateResults, PluginShopifyMutateResultsConfig]
	| [typeof pluginShopifyAddToCart, PluginShopifyAddToCartConfig]
	// bigCommerce
	| [typeof pluginBigcommerceBackgroundFilters, PluginBigcommerceBackgroundFiltersConfig]
	| [typeof pluginBigcommerceAddToCart, PluginBigCommerceAddToCartConfig]
	// magento2
	| [typeof pluginMagento2BackgroundFilters, PluginMagento2BackgroundFiltersConfig]
	| [typeof pluginMagento2AddToCart, PluginMagento2AddToCartConfig];

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
		const editMode = Boolean((urlParams?.params?.query && TEMPLATE_EDITOR_PARAM in urlParams.params.query) || cookies.get(THEME_EDIT_COOKIE));

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
						const TemplateEditorStore = (await import('../Templates/Stores/TemplateEditorStore')).TemplateEditorStore;
						const templateEditorStore = new TemplateEditorStore();
						this.templates.editor = templateEditorStore;

						const storage = new StorageStore({ type: StorageType.local, key: 'ss-templates' });
						const controllerOverrides = storage.get('controllerOverrides');
						if (!controllerOverrides?.['search'] || (controllerOverrides?.['search'] && Object.keys(controllerOverrides['search']).length == 0)) {
							// this is an inital page load without overrides
							// register the controllers config into the templateEditorStore
							// tempalteEditorStore will need to also save that to localstorage separatly for furture reset-to values when overrides exist
							const searchDefaultControllerConfig = (this.controllers['search'] as SearchController).config;
							templateEditorStore.registerInitialControllerConfig('search', searchDefaultControllerConfig);
						}

						if (
							!controllerOverrides?.['autocomplete'] ||
							(controllerOverrides?.['autocomplete'] && Object.keys(controllerOverrides['autocomplete']).length == 0)
						) {
							const autocompleteDefaultControllerConfig = (this.controllers['autocomplete'] as AutocompleteController).config;
							templateEditorStore.registerInitialControllerConfig('autocomplete', autocompleteDefaultControllerConfig);
						}

						render(
							<TemplateEditor
								templatesStore={templatesStore}
								editorStore={templateEditorStore}
								snap={this}
								onRemoveClick={() => {
									cookies.unset(THEME_EDIT_COOKIE);
									const urlState = url(window.location.href);
									delete urlState?.params.query[TEMPLATE_EDITOR_PARAM];

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
		if (!target.resultComponent && templateConfig.theme.resultComponent) {
			target.resultComponent = templateConfig.theme.resultComponent;
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
		if (!target.resultComponent && templateConfig.theme.resultComponent) {
			target.resultComponent = templateConfig.theme.resultComponent;
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
			props: { type: 'autocomplete', templatesStore, targetId },
			hideTarget: true,
		};

		if (target.inputSelector) targeter.props!.input = target.inputSelector;

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
				if (!target.resultComponent && templateConfig.theme.resultComponent) {
					target.resultComponent = templateConfig.theme.resultComponent;
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
	const storage = new StorageStore({ type: StorageType.local, key: 'ss-templates' });
	const controllerOverrides = storage.get('controllerOverrides');

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
				plugins: createPlugins(templateConfig, templatesStore, 'search'),
				settings: deepmerge(templateConfig.search.settings || {}, controllerOverrides?.['search'] || {}),
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
			deepmerge(DEFAULT_AUTOCOMPLETE_CONTROLLER_SETTINGS, templateConfig.autocomplete.settings || {}),
			controllerOverrides?.['autocomplete'] || {}
		);

		const autocompleteControllerConfig = {
			config: {
				id: 'autocomplete',
				plugins: createPlugins(templateConfig, templatesStore, 'autocomplete'),
				selector: templateConfig.autocomplete.targets.map((target) => target.inputSelector || target.selector).join(', '),
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
				plugins: createPlugins(templateConfig, templatesStore, 'recommendation'),
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

// TODO: DRY up and support dynamic imports
function createPlugins(
	templateConfig: SnapTemplatesConfig,
	templatesStore: TemplatesStore,
	controllerType?: 'autocomplete' | 'search' | 'recommendation'
): PluginGrouping[] {
	const plugins: TemplatePluginGrouping = [];
	let controllerConfig;
	if (controllerType) {
		controllerConfig = templateConfig[controllerType] || {};
	}

	plugins.push([
		templatesStore.library.import.plugins.common.backgroundFilters,
		deepmerge(templateConfig.plugins?.common?.backgroundFilters || {}, controllerConfig?.plugins?.common?.backgroundFilters || {}),
	]);

	plugins.push([
		templatesStore.library.import.plugins.common.scrollToTop,
		deepmerge(templateConfig.plugins?.common?.scrollToTop || {}, controllerConfig?.plugins?.common?.scrollToTop || {}),
	]);
	plugins.push([
		templatesStore.library.import.plugins.common.logger,
		deepmerge(templateConfig.plugins?.common?.logger || {}, controllerConfig?.plugins?.common?.logger || {}),
	]);

	switch (templatesStore.platform) {
		case 'shopify':
			plugins.push([
				templatesStore.library.import.plugins.shopify.backgroundFilters,
				deepmerge(templateConfig.plugins?.shopify?.backgroundFilters || {}, controllerConfig?.plugins?.shopify?.backgroundFilters || {}),
			]);
			plugins.push([
				templatesStore.library.import.plugins.shopify.mutateResults,
				deepmerge(templateConfig.plugins?.shopify?.mutateResults || {}, controllerConfig?.plugins?.shopify?.mutateResults || {}),
			]);
			plugins.push([
				templatesStore.library.import.plugins.shopify.addToCart,
				deepmerge(templateConfig.plugins?.shopify?.addToCart || {}, controllerConfig?.plugins?.shopify?.addToCart || {}),
			]);
			break;
		case 'bigCommerce':
			plugins.push([
				templatesStore.library.import.plugins.bigcommerce.backgroundFilters,
				deepmerge(templateConfig.plugins?.bigCommerce?.backgroundFilters || {}, controllerConfig?.plugins?.bigCommerce?.backgroundFilters || {}),
			]);
			plugins.push([
				templatesStore.library.import.plugins.bigcommerce.addToCart,
				deepmerge(templateConfig.plugins?.bigCommerce?.addToCart || {}, controllerConfig?.plugins?.bigCommerce?.addToCart || {}),
			]);
			break;
		case 'magento2':
			plugins.push([
				templatesStore.library.import.plugins.magento2.backgroundFilters,
				deepmerge(templateConfig.plugins?.magento2?.backgroundFilters || {}, controllerConfig?.plugins?.magento2?.backgroundFilters || {}),
			]);
			plugins.push([
				templatesStore.library.import.plugins.magento2.addToCart,
				deepmerge(templateConfig.plugins?.magento2?.addToCart || {}, controllerConfig?.plugins?.magento2?.addToCart || {}),
			]);
			break;
		case 'other':
			plugins.push([
				templatesStore.library.import.plugins.common.addToCart,
				deepmerge(templateConfig.plugins?.common?.addToCart || {}, controllerConfig?.plugins?.common?.addToCart || {}),
			]);
		default:
			break;
	}

	return plugins as PluginGrouping[];
}
