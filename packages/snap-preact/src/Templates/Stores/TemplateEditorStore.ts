import { AutocompleteStoreConfigSettings, SearchStoreConfigSettings, StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { observable, makeObservable } from 'mobx';

import deepmerge from 'deepmerge';
import { TemplatesStore } from './TemplateStore';
import { ThemeStore } from './ThemeStore';
import { AutocompleteController, AutocompleteControllerConfig, SearchController, SearchControllerConfig } from '@searchspring/snap-controller';

import type { AbstractionGroup } from '../../types';

export type Tabs = 'Templates' | 'Configuration';

type DefaultControllerConfigs = {
	search: SearchStoreConfigSettings;
	autocomplete: AutocompleteStoreConfigSettings;
};

export class TemplateEditorStore {
	storage: StorageStore;

	tabs: Tabs[] = ['Templates', 'Configuration'];
	activeTab: Tabs = 'Templates';
	variableOverrides = {};
	controllerOverrides = {};
	templatesStore?: TemplatesStore;
	defaultControllerConfigs?: DefaultControllerConfigs;
	reloadRequired: boolean = false;

	uiAbstractions: {
		search: AbstractionGroup<SearchController>[];
		autocomplete: AbstractionGroup<AutocompleteController>[];
	} = {
		search: [
			{
				title: 'Infinite Scroll',
				description: 'Determines weather or not to use infinite scroll for pagination.',
				controls: [
					{
						type: 'checkbox',
						label: 'Enabled',
						description: 'Determines wether or not infinite be scroll be used.',
						getValue: (controller: SearchController) => {
							// Boolean indicating if infinite scroll is enabled.
							return Boolean(controller.config.settings?.infinite?.enabled);
						},
						onValueChange: (newValue, setOverride, controller) => {
							setOverride({ path: ['infinite', 'enabled'], value: newValue, controller });
						},
						// TODO: Implement reset functionality
						// shouldShowReset: (templateEditorStore, controller) => {

						// },
						onReset: (setOverride, controller) => {
							setOverride({ path: ['infinite', 'enabled'], controller });
						},
					},
				],
			},
		],
		autocomplete: [
			{
				title: 'Term Settings',
				description: 'Configure the behavior of autocomplete suggestions, including history and trending terms.',
				controls: [
					{
						type: 'dropdown',
						label: 'Search History',
						description: 'Number of previously searched terms to display in history terms section',
						options: ['Disabled', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
						getValue: (controller: AutocompleteController) => {
							// If history is enabled, the value is the limit. Otherwise, it's 'Disabled'.
							return controller.config.settings?.history?.enabled ? controller.config.settings.history.limit ?? 'Disabled' : 'Disabled';
						},
						onValueChange: (newValue, setOverride, controller) => {
							if (newValue === 'Disabled') {
								setOverride({ path: ['history'], value: { enabled: false, limit: undefined }, controller });
							} else {
								setOverride({ path: ['history'], value: { enabled: true, limit: Number(newValue) }, controller });
							}
						},
						onReset: (setOverride, controller) => {
							// Resetting history settings to default.
							setOverride({ path: ['history'], controller });
							// setOverride({ path: ['history', 'enabled'], value: false, controller });
						},
					},
					{
						type: 'dropdown',
						label: 'Trending Searches',
						description: 'Number of trending terms to display in trending terms section',
						options: ['Disabled', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
						getValue: (controller: AutocompleteController) => {
							// If trending is enabled, the value is the limit. Otherwise, it's 'Disabled'.
							return controller.config.settings?.trending?.enabled ? controller.config.settings.trending.limit ?? 'Disabled' : 'Disabled';
						},
						onValueChange: (newValue, setOverride, controller) => {
							if (newValue === 'Disabled') {
								setOverride({ path: ['trending'], value: { enabled: false, limit: undefined }, controller });
							} else {
								setOverride({ path: ['trending'], value: { enabled: true, limit: Number(newValue) }, controller });
							}
						},
						onReset: (setOverride, controller) => {
							// Resetting trending settings to default.
							setOverride({ path: ['trending'], controller });
						},
					},
					{
						type: 'dropdown',
						label: 'Show Results For',
						description: '',
						getDisplayState: (controller: AutocompleteController) => {
							// This control is disabled if both History and Trending are 'Disabled'.
							const enabled = controller.config.settings?.history?.enabled || controller.config.settings?.trending?.enabled;
							return enabled ? 'visible' : 'disabled';
						},
						options: (controller: AutocompleteController) => {
							// The options depend on the values of the other controls.
							const historyEnabled = controller.config.settings?.history?.enabled;
							const trendingEnabled = controller.config.settings?.trending?.enabled;

							const opts = ['Disabled'];
							if (historyEnabled) opts.push('History');
							if (trendingEnabled) opts.push('Trending');
							return opts;
						},
						getValue: (controller: AutocompleteController) => {
							if (controller.config.settings?.history?.showResults) return 'History';
							if (controller.config.settings?.trending?.showResults) return 'Trending';
							return 'Disabled';
						},
						onValueChange: (newValue, setOverride, controller) => {
							// This single change affects two low-level settings.
							setOverride({ path: ['history', 'showResults'], value: newValue === 'History', controller });
							setOverride({ path: ['trending', 'showResults'], value: newValue === 'Trending', controller });

							// setControllerOveride - set override storage AND update controller config at runtime
						},
						onReset: (setOverride, controller) => {
							// Resetting the show results setting to default.
							setOverride({ path: ['history', 'showResults'], controller });
							setOverride({ path: ['trending', 'showResults'], controller });
						},
					},
				],
			},
			// You can add other groups here in the future, for 'search' or more 'autocomplete' settings.
		],
	};

	constructor() {
		this.storage = new StorageStore({ type: StorageType.local, key: 'ss-templates' });
		this.variableOverrides = this.storage.get('variableOverrides') || {};
		this.controllerOverrides = this.storage.get('controllerOverrides') || {};
		this.defaultControllerConfigs = this.storage.get('defaultControllerConfigs') || {};

		makeObservable(this, {
			reloadRequired: observable,
			activeTab: observable,
			controllerOverrides: observable,
			defaultControllerConfigs: observable,
		});
	}

	registerDefaultControllerConfig(type: keyof DefaultControllerConfigs, config: SearchControllerConfig | AutocompleteControllerConfig) {
		this.defaultControllerConfigs = deepmerge<DefaultControllerConfigs>(this.defaultControllerConfigs || {}, { [type]: config });
		this.storage.set('defaultControllerConfigs', this.defaultControllerConfigs);
	}

	resetAllVariables(themeRef: ThemeStore) {
		this.variableOverrides = {};
		this.storage.set('variableOverrides', this.variableOverrides);
		themeRef.setEditorOverrides(this.variableOverrides);
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
		themeRef.setEditorOverrides(this.variableOverrides);
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
		themeRef.setEditorOverrides(this.variableOverrides);
		this.storage.set('variableOverrides', this.variableOverrides);
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
			const defaultConfig = this.defaultControllerConfigs?.[feat as keyof typeof this.controllerOverrides]['settings'];
			let workingConfig = defaultConfig;
			let value = '';

			path.forEach((p) => {
				if (typeof workingConfig === 'object' && workingConfig && typeof workingConfig[p] === 'object') {
					workingConfig = workingConfig[p];
				} else if (typeof workingConfig?.[p] !== 'undefined') {
					console.log('getDefaultValue is returning', workingConfig?.[p]);
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

		console.log('controller config overrides set with:', controllerOverrides);

		this.controllerOverrides = deepmerge(this.controllerOverrides, controllerOverrides);

		console.log('controller configs after overrides merged:', this.controllerOverrides);

		this.storage.set('controllerOverrides', this.controllerOverrides);

		const activeConfig = {
			[feat]: path
				.slice()
				.reverse()
				.reduce((res, key) => {
					if (path.indexOf(key) === path.length - 1) {
						return {
							[key]: value ?? getDefaultValue(),
						};
					}
					return {
						[key]: res,
					};
				}, {}),
		};

		// merging default with active - where is current?

		const newActiveConfig = deepmerge(
			deepmerge<any>(
				// this.defaultControllerConfigs?.[feat as keyof typeof this.controllerOverrides] || {},
				controller.config,
				this.controllerOverrides[feat as keyof typeof this.controllerOverrides]
			),
			{
				settings: activeConfig[feat as keyof typeof this.controllerOverrides],
			}
		);

		// const newActiveConfig = deepmerge(this.defaultControllerConfigs?.[feat as keyof typeof this.controllerOverrides] || {}, {
		// 	settings: activeConfig[feat as keyof typeof this.controllerOverrides],
		// });

		console.log('controller config set with:', newActiveConfig);

		controller?.setConfig(newActiveConfig);
		controller?.store.setConfig(newActiveConfig as any);
	}

	switchTabs(tab: Tabs) {
		this.activeTab = tab;
	}
}
