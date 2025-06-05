import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { observable, makeObservable } from 'mobx';

import deepmerge from 'deepmerge';
import { TemplatesStore } from './TemplateStore';
import { ThemeStore } from './ThemeStore';

export type Tabs = 'Templates' | 'Configuration';
export class TemplateEditorStore {
	storage: StorageStore;

	tabs: Tabs[] = ['Templates', 'Configuration'];
	activeTab: Tabs = 'Configuration';
	variableOverrides = {};
	templatesStore?: TemplatesStore;

	constructor() {
		this.storage = new StorageStore({ type: StorageType.local, key: 'ss-templates' });
		this.variableOverrides = this.storage.get('variableOverrides') || {};

		makeObservable(this, {
			activeTab: observable,
		});
	}

	resetVariable(obj: { themeName: string; path: string[]; rootEditingKey: string; value: unknown }, themeRef: ThemeStore) {
		const { path, rootEditingKey } = JSON.parse(JSON.stringify(obj));

		let variableOverrides = this.variableOverrides[rootEditingKey as keyof typeof this.variableOverrides];
		console.log('variableOverrides', variableOverrides, path);
		path.forEach((p, i) => {
			if (i === path.length - 1) {
				delete variableOverrides[p];
			} else {
				variableOverrides = variableOverrides[p];
			}
		});

		this.variableOverrides = variableOverrides;
		this.storage.set('variableOverrides', this.variableOverrides);

		themeRef.forceUpdate();
	}

	setVariable(obj: { themeName: string; path: string[]; rootEditingKey: string; value: unknown }, themeRef: ThemeStore) {
		const { path, value } = JSON.parse(JSON.stringify(obj));
		const variableOverrides = {
			variables: path.reverse().reduce((res, key) => {
				if (path.indexOf(key) === 0) {
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
		themeRef.setOverride(obj); // call to re-render in real time
	}

	switchTabs(tab: Tabs) {
		this.activeTab = tab;
	}
}
