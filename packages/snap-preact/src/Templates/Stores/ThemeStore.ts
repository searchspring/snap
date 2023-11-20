import { observable, makeObservable } from 'mobx';
// import { memo } from 'preact/compat';
// import { observable, makeObservable } from 'mobx';
import { Dependancies, combineMerge } from './TemplateStore';
import deepmerge from 'deepmerge';
import type { Theme } from '@searchspring/snap-preact-components';
// import { StorageStore } from '@searchspring/snap-store-mobx';
export class ThemeStore {
	name: string;
	base: Theme;
	overrides: Theme;
	variables: Theme;
	currency: Theme;
	language: Theme;
	// custom: { storage: StorageStore; set: (path: string[], value: string) => void; theme: Theme };
	isFromStorage: boolean;

	constructor(
		obj: { name: string; base: Theme; overrides?: Theme; variables?: Theme; currency: Theme; language: Theme },
		dependencies: Dependancies
	) {
		const { name, base, overrides, variables, currency, language } = obj;
		this.name = name;
		this.base = base;
		this.overrides = overrides || {};
		this.variables = { variables: variables || {} };
		this.currency = currency;
		this.language = language;

		const storedOverrides = dependencies.storage.get(this.name);
		this.isFromStorage = Boolean(Object.keys(storedOverrides || {})?.length);
		this.overrides = storedOverrides || {};

		// this.custom = {
		// 	// TODO
		// 	storage: dependencies.storage,
		// 	set: () => {
		// 		// TODO
		// 	},
		// 	theme: {},
		// };
		makeObservable(this, {
			name: observable,
			base: observable,
			overrides: observable,
			variables: observable,
			currency: observable,
			language: observable,
			isFromStorage: observable,
		});
	}

	public get theme(): Theme {
		return mergeLayers(
			this.base,
			this.overrides,
			this.variables,
			this.currency,
			this.language
			// this.custom (editor stored theme changes)
		);
	}

	// public setLanguage(language: string) {
	//     this.language = language;
	// }
	// public setCurrenct(currency: string) {
	//     this.currency = currency;
	// }

	// public setOverride(obj: { path: string[]; rootEditingKey: string; value: string }) {
	//     const { path, rootEditingKey, value } = obj;
	//     const overrides = {
	// 		[rootEditingKey]: path.reverse().reduce((res, key) => {
	// 			if (path.indexOf(key) === 0) {
	// 				return {
	// 					[key]: value,
	// 				};
	// 			}
	// 			return {
	// 				[key]: res,
	// 			};
	// 		}, {}),
	// 	};
	//     this.overrides = deepmerge(this.overrides, overrides, { arrayMerge: combineMerge });
	// }
}

function mergeLayers(...layers: Theme[]): Theme {
	// TODO: memoize
	return deepmerge.all(layers, { arrayMerge: combineMerge });
}
