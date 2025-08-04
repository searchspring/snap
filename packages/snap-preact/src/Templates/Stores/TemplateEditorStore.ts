import { AutocompleteStoreConfigSettings, SearchStoreConfigSettings, StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { observable, makeObservable } from 'mobx';

import deepmerge from 'deepmerge';
import { TemplatesStore } from './TemplateStore';
import { ThemeStore } from './ThemeStore';
import { AutocompleteController, AutocompleteControllerConfig, SearchController, SearchControllerConfig } from '@searchspring/snap-controller';

import type { AbstractionGroup } from '../../types';

export type Tabs = 'Templates' | 'Configuration';

type ControllerConfigsObject = {
	search: SearchStoreConfigSettings;
	autocomplete: AutocompleteStoreConfigSettings;
};

export class TemplateEditorStore {
	storage: StorageStore;

	tabs: Tabs[] = ['Templates', 'Configuration'];
	activeTab: Tabs = 'Templates';
	variableOverrides = {};
	controllerOverrides: {
		search?: SearchStoreConfigSettings;
		autocomplete?: AutocompleteStoreConfigSettings;
	} = {};
	templatesStore?: TemplatesStore;
	initialControllerConfigs?: ControllerConfigsObject;
	reloadRequired: boolean = false;

	uiAbstractions: {
		search: AbstractionGroup<SearchController>[];
		autocomplete: AbstractionGroup<AutocompleteController>[];
	} = {
		search: [
			{
				title: '',
				description: '',
				controls: [
					{
						type: 'checkbox',
						label: 'Infinite Scroll',
						description: 'Enable infinite scroll',
						getValue: (controller: SearchController) => {
							return Boolean(controller.store.config.settings?.infinite?.enabled);
						},
						shouldShowReset: () => {
							return typeof this.controllerOverrides?.search?.infinite?.enabled === 'boolean';
						},
						onValueChange: ({ value, controller }) => {
							this.setControllerOverride({ path: ['infinite', 'enabled'], value, controller });
						},
						onReset: ({ controller }) => {
							this.setControllerOverride({ path: ['infinite', 'enabled'], controller });
						},
					},
				],
			},
		],
		autocomplete: [
			{
				title: '',
				description: '',
				controls: [
					{
						type: 'dropdown',
						label: 'History Terms',
						description: '',
						options: ['Disabled', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
						getValue: (controller: AutocompleteController) => {
							return controller.store.config.settings?.history?.enabled ? controller.store.config.settings.history.limit ?? 'Disabled' : 'Disabled';
						},
						shouldShowReset: () => {
							return !!(this.controllerOverrides?.autocomplete?.history?.enabled && this.controllerOverrides?.autocomplete?.history?.limit);
						},
						onValueChange: ({ value, controller }) => {
							if (value === 'Disabled') {
								this.setControllerOverride({ path: ['history'], value: { enabled: false, limit: undefined, showResults: undefined }, controller });
							} else {
								this.setControllerOverride({ path: ['history'], value: { enabled: true, limit: Number(value) }, controller });
							}
							controller.store.initHistory();

							const trendingResultsEnabled =
								controller.store.trending?.length &&
								controller.config.settings?.trending?.enabled &&
								controller.config.settings?.trending?.showResults;
							const historyResultsEnabled =
								controller.store.history?.length && controller.config.settings?.history?.enabled && controller.config.settings?.history?.showResults;
							if (trendingResultsEnabled) {
								controller.store.trending[0].preview();
							} else if (historyResultsEnabled) {
								controller.store.history[0].preview();
							} else {
								controller.urlManager.reset().go();
							}
						},
						onReset: ({ controller }) => {
							this.setControllerOverride({ path: ['history'], controller });
						},
					},
					{
						type: 'dropdown',
						label: 'Trending Terms',
						description: '',
						options: ['Disabled', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
						getValue: (controller: AutocompleteController) => {
							return controller.store.config.settings?.trending?.enabled ? controller.store.config.settings.trending.limit ?? 'Disabled' : 'Disabled';
						},
						shouldShowReset: () => {
							return !!(this.controllerOverrides?.autocomplete?.trending?.enabled && this.controllerOverrides?.autocomplete?.trending?.limit);
						},
						onValueChange: async ({ value, controller }) => {
							if (value === 'Disabled') {
								this.setControllerOverride({ path: ['trending'], value: { enabled: false, limit: undefined, showResults: undefined }, controller });
							} else {
								this.setControllerOverride({ path: ['trending'], value: { enabled: true, limit: Number(value) }, controller });
							}
							controller.storage.set('terms', '');
							await controller.searchTrending();

							const trendingResultsEnabled =
								controller.store.trending?.length &&
								controller.config.settings?.trending?.enabled &&
								controller.config.settings?.trending?.showResults;
							const historyResultsEnabled =
								controller.store.history?.length && controller.config.settings?.history?.enabled && controller.config.settings?.history?.showResults;
							if (trendingResultsEnabled) {
								controller.store.trending[0].preview();
							} else if (historyResultsEnabled) {
								controller.store.history[0].preview();
							} else {
								controller.urlManager.reset().go();
							}
						},
						onReset: ({ controller }) => {
							this.setControllerOverride({ path: ['trending'], controller });
						},
					},
					{
						type: 'dropdown',
						label: 'Initial Results',
						description: '',
						getDisplayState: (controller: AutocompleteController) => {
							const enabled = controller.store.config.settings?.history?.enabled || controller.store.config.settings?.trending?.enabled;
							return enabled ? 'visible' : 'disabled';
						},
						options: (controller: AutocompleteController) => {
							const historyEnabled = controller.store.config.settings?.history?.enabled;
							const trendingEnabled = controller.store.config.settings?.trending?.enabled;

							const opts = ['Disabled'];
							if (historyEnabled) opts.push('History');
							if (trendingEnabled) opts.push('Trending');
							return opts;
						},
						getValue: (controller: AutocompleteController) => {
							if (controller.store.config.settings?.history?.showResults) return 'History';
							if (controller.store.config.settings?.trending?.showResults) return 'Trending';
							return 'Disabled';
						},
						shouldShowReset: () => {
							const historyEnabled = this.controllerOverrides?.autocomplete?.history?.showResults;
							const trendingEnabled = this.controllerOverrides?.autocomplete?.trending?.showResults;
							return !!(historyEnabled || trendingEnabled);
						},
						onValueChange: ({ value, controller }) => {
							this.setControllerOverride({ path: ['history', 'showResults'], value: value === 'History', controller });
							this.setControllerOverride({ path: ['trending', 'showResults'], value: value === 'Trending', controller });

							const trendingResultsEnabled =
								controller.store.trending?.length &&
								controller.config.settings?.trending?.enabled &&
								controller.config.settings?.trending?.showResults;
							const historyResultsEnabled =
								controller.store.history?.length && controller.config.settings?.history?.enabled && controller.config.settings?.history?.showResults;
							if (trendingResultsEnabled) {
								controller.store.trending[0].preview();
							} else if (historyResultsEnabled) {
								controller.store.history[0].preview();
							} else {
								controller.urlManager.reset().go();
							}
						},
						onReset: ({ controller }) => {
							this.setControllerOverride({ path: ['history', 'showResults'], controller });
							this.setControllerOverride({ path: ['trending', 'showResults'], controller });
						},
					},
				],
			},
		],
	};

	constructor() {
		this.storage = new StorageStore({ type: StorageType.local, key: 'ss-templates' });
		this.variableOverrides = this.storage.get('variableOverrides') || {};
		this.controllerOverrides = this.storage.get('controllerOverrides') || {};
		this.initialControllerConfigs = this.storage.get('initialControllerConfigs') || {};

		makeObservable(this, {
			reloadRequired: observable,
			activeTab: observable,
			controllerOverrides: observable,
			initialControllerConfigs: observable,
			uiAbstractions: observable,
		});
	}

	registerInitialControllerConfig(type: keyof ControllerConfigsObject, config: SearchControllerConfig | AutocompleteControllerConfig) {
		const configCopy = JSON.parse(JSON.stringify(config));
		delete configCopy.plugins; // remove plugins from config as they are not needed for initial config
		this.initialControllerConfigs = deepmerge<ControllerConfigsObject>(this.initialControllerConfigs || {}, { [type]: configCopy });
		this.storage.set('initialControllerConfigs', this.initialControllerConfigs);
	}

	resetAllVariables(themeRef: ThemeStore) {
		this.variableOverrides = {};
		this.storage.set('variableOverrides', this.variableOverrides);
		themeRef.updateEditorOverrides();
	}

	resetVariable(obj: { themeName: string; path: string[]; rootEditingKey: string; value: unknown }, themeRef: ThemeStore) {
		const { path, rootEditingKey } = obj;

		let variableOverrides = this.variableOverrides[rootEditingKey as keyof typeof this.variableOverrides];
		console.log('variableOverrides reset begin', variableOverrides, path);
		path.forEach((p, i) => {
			if (i === path.length - 1) {
				delete variableOverrides[p];
			} else {
				variableOverrides = variableOverrides[p];
			}
		});

		this.storage.set('variableOverrides', this.variableOverrides);

		console.log('variableOverrides after reset', this.variableOverrides);
		themeRef.updateEditorOverrides();
	}

	setVariable(obj: { path: string[]; value: unknown }, themeRef: ThemeStore) {
		const { path, value } = obj;
		const variableOverrides = {
			variables: path
				.slice()
				.reverse()
				.reduce((res, key) => {
					if (path.indexOf(key) === path.length - 1) {
						return {
							[key]: value,
						};
					}
					return {
						[key]: res,
					};
				}, {}),
		};
		this.variableOverrides = deepmerge(this.variableOverrides, variableOverrides);
		this.storage.set('variableOverrides', this.variableOverrides);
		themeRef.updateEditorOverrides();
	}

	// Helper function to deeply delete properties from an object based on a mask
	private deepDelete(target: any, mask: any) {
		if (typeof target !== 'object' || typeof mask !== 'object' || !target || !mask) return;
		Object.keys(mask).forEach((key) => {
			if (key in target) {
				if (typeof mask[key] === 'object' && mask[key] && typeof target[key] === 'object' && target[key]) {
					this.deepDelete(target[key], mask[key]);
					// If after deletion, the object is empty, remove it
					if (Object.keys(target[key]).length === 0) {
						delete target[key];
					}
				} else {
					delete target[key];
				}
			}
		});
	}

	setControllerOverride(obj: { path: string[]; value?: unknown; controller: SearchController | AutocompleteController }) {
		const { path, value, controller } = obj;
		const feat = controller.type;

		console.log('setControllerOverride called with', feat, path, value);

		const getDefaultValue = (): unknown => {
			// @ts-ignore - // TODO: fix typing
			const defaultConfig = this.initialControllerConfigs?.[feat as keyof typeof this.controllerOverrides]['settings'];
			let workingConfig = defaultConfig;
			let value;

			path.forEach((p, index) => {
				if (index === path.length - 1 && p in workingConfig) {
					value = workingConfig?.[p];
				} else if (typeof workingConfig === 'object' && workingConfig && typeof workingConfig[p] === 'object') {
					workingConfig = workingConfig[p];
				} else if (typeof workingConfig?.[p] !== 'undefined') {
					value = workingConfig?.[p];
				}
			});
			return value;
		};

		const controllerOverrides = {
			[feat]: path
				.slice()
				.reverse()
				.reduce((res, key) => {
					if (path.indexOf(key) === path.length - 1) {
						return {
							[key]: value,
						};
					}
					return {
						[key]: res,
					};
				}, {}),
		};

		this.controllerOverrides = deepmerge(this.controllerOverrides, controllerOverrides);
		this.storage.set('controllerOverrides', this.controllerOverrides);

		const defaultValue = getDefaultValue();
		const activeConfig = {
			[feat]: path
				.slice()
				.reverse()
				.reduce((res, key) => {
					if (path.indexOf(key) === path.length - 1) {
						return {
							[key]: value ?? defaultValue,
						};
					}
					return {
						[key]: res,
					};
				}, {}),
		};
		const newActiveConfig = deepmerge(
			deepmerge<any>(controller.store.config, this.controllerOverrides[feat as keyof typeof this.controllerOverrides] || {}),
			{
				settings: activeConfig[feat as keyof typeof this.controllerOverrides],
			}
		);

		controller?.setConfig(newActiveConfig);
		controller?.store.setConfig(newActiveConfig as any);
	}

	switchTabs(tab: Tabs) {
		this.activeTab = tab;
	}
}
