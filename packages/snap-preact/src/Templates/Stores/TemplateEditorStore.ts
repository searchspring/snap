import { AutocompleteStoreConfigSettings, SearchStoreConfigSettings, StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { observable, makeObservable } from 'mobx';

import deepmerge from 'deepmerge';
import { TemplatesStore } from './TemplateStore';
import { ThemeStore } from './ThemeStore';
import { AutocompleteController, SearchController } from '@searchspring/snap-controller';

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
	refinedControllerSettings: {
		[feat: string]: {
			[setting: string]: {
				description: string;
				link: string;
				control: {
					type: 'boolean' | 'number' | 'string';
					label: string;
				};
			};
		};
	} = {
		search: {
			'infinite.enabled': {
				description: 'boolean to enable infinite scroll',
				link: 'https://searchspring.github.io/snap/#/package-controller-search',
				control: { type: 'boolean', label: 'Enabled Infinite Scroll' },
			},
		},
		autocomplete: {
			'history.enabled': {
				description: 'boolean to enable autocomplete term history',
				link: 'https://searchspring.github.io/snap/#/package-controller-autocomplete',
				control: { type: 'boolean', label: 'Enable History Terms' },
			},
			'history.limit': {
				description: 'number of terms to store in history',
				link: 'https://searchspring.github.io/snap/#/package-controller-autocomplete',
				control: { type: 'number', label: 'History Terms Limit' },
			},
			'history.showResults': {
				description: 'boolean to select the first history term in autocomplete',
				link: 'https://searchspring.github.io/snap/#/package-controller-autocomplete',
				control: { type: 'boolean', label: 'Show History Results' },
			},
			'trending.enabled': {
				description: 'boolean to enable autocomplete trending terms',
				link: 'https://searchspring.github.io/snap/#/package-controller-autocomplete',
				control: { type: 'boolean', label: 'Enable Trending Terms' },
			},
			'trending.limit': {
				description: 'number of trending terms to retrieve',
				link: 'https://searchspring.github.io/snap/#/package-controller-autocomplete',
				control: { type: 'number', label: 'Trending Terms Limit' },
			},
			'trending.showResults': {
				description: 'boolean to select the first trending term in autocomplete',
				link: 'https://searchspring.github.io/snap/#/package-controller-autocomplete',
				control: { type: 'boolean', label: 'Show Trending Results' },
			},
		},
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
		});
	}

	registerDefaultControllerConfig(type: keyof DefaultControllerConfigs, config: SearchStoreConfigSettings | AutocompleteStoreConfigSettings) {
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

	resetControllerOverride(obj: { path: string[]; feat: string; controller?: SearchController | AutocompleteController }) {
		const { path, feat } = obj;
		let controllerOverrides = this.controllerOverrides[feat as keyof typeof this.controllerOverrides];
		path.forEach((p, i) => {
			if (i === path.length - 1) {
				delete controllerOverrides[p];
			} else {
				controllerOverrides = controllerOverrides[p];
			}
		});

		// function to delele empty objects within this.controllerOverrides[feat]
		const deleteEmptyObjects = (obj: any) => {
			Object.keys(obj).forEach((key) => {
				if (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0) {
					delete obj[key];
				} else if (typeof obj[key] === 'object') {
					deleteEmptyObjects(obj[key]);
				}
			});
		};

		deleteEmptyObjects(this.controllerOverrides[feat as keyof typeof this.controllerOverrides]);
		this.storage.set('controllerOverrides', this.controllerOverrides);
		// this.reloadRequired = true;
		// if(controller) {
		// 	// not applicable to Recs
		// 	const defaultConfig = JSON.parse(JSON.stringify(this.defaultControllerConfigs?.[feat as keyof typeof this.controllerOverrides] || {}));
		// 	const overrides = this.controllerOverrides[feat as keyof typeof this.controllerOverrides] || {};
		// 	this.deepDelete(defaultConfig, overrides);
		// 	controller.setConfig(defaultConfig);
		// }
	}

	setControllerOverride(obj: { path: string[]; value: unknown; feat: string; controller?: SearchController | AutocompleteController }) {
		const { path, value, feat } = obj;
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
		// this.reloadRequired = true;
		// if(controller) {
		// 	// not applicable to Recs
		// 	const newConfig = deepmerge(this.defaultControllerConfigs?.[feat as keyof typeof this.controllerOverrides] || {}, this.controllerOverrides[feat as keyof typeof this.controllerOverrides])
		// 	controller.setConfig(newConfig);
		// }
	}

	switchTabs(tab: Tabs) {
		this.activeTab = tab;
	}
}
