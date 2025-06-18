import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { observable, makeObservable } from 'mobx';

import deepmerge from 'deepmerge';
import { TemplatesStore } from './TemplateStore';
import { ThemeStore } from './ThemeStore';

export type Tabs = 'Templates' | 'Configuration';
export class TemplateEditorStore {
	storage: StorageStore;

	tabs: Tabs[] = ['Templates', 'Configuration'];
	activeTab: Tabs = 'Templates';
	variableOverrides = {};
	controllerOverrides = {};
	templatesStore?: TemplatesStore;

	constructor() {
		this.storage = new StorageStore({ type: StorageType.local, key: 'ss-templates' });
		this.variableOverrides = this.storage.get('variableOverrides') || {};
		this.controllerOverrides = this.storage.get('controllerOverrides') || {};

		makeObservable(this, {
			activeTab: observable,
		});
	}

	resetAllVariables(themeRef: ThemeStore) {
		this.variableOverrides = {};
		this.storage.set('variableOverrides', this.variableOverrides);
		themeRef.setEditorOverrides(this.variableOverrides);
	}

	resetVariable(obj: { themeName: string; path: string[]; rootEditingKey: string; value: unknown }, themeRef: ThemeStore) {
		// const { path, rootEditingKey } = JSON.parse(JSON.stringify(obj));
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

		// this.variableOverrides = variableOverrides;
		this.storage.set('variableOverrides', this.variableOverrides);

		console.log('variableOverrides after reset', this.variableOverrides);
		// themeRef.forceUpdate();
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

	setControllerOverride(obj: { path: string[]; value: unknown; feat: string }) {
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
	}

	switchTabs(tab: Tabs) {
		this.activeTab = tab;
	}
}
