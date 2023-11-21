import { observable, makeObservable } from 'mobx';
// import { memo } from 'preact/compat';
// import { observable, makeObservable } from 'mobx';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import type { Theme } from '@searchspring/snap-preact-components';
import type { StorageStore } from '@searchspring/snap-store-mobx';
import { TemplateThemeTypes } from './TemplateStore';

export class ThemeStore {
	name: string;
	type: string;
	base: Theme;
	overrides: Theme;
	variables: Theme;
	currency: Theme;
	language: Theme;
	// stored: Theme;
	// custom: { storage: StorageStore; set: (path: string[], value: string) => void; theme: Theme };

	constructor(
		config: { name: string; type: TemplateThemeTypes; base: Theme; overrides?: Theme; variables?: Theme; currency: Theme; language: Theme },
		dependencies: { storage: StorageStore }
	) {
		const { name, type, base, overrides, variables, currency, language } = config;
		this.name = name;
		this.type = type;
		this.base = base;
		this.overrides = overrides || {};
		this.variables = variables || {};
		this.currency = currency;
		this.language = language;

		console.log('need to add local storage using:', dependencies);

		makeObservable(this, {
			name: observable,
			base: observable,
			overrides: observable,
			variables: observable,
			currency: observable,
			language: observable,
		});
	}

	public get theme(): Theme {
		return mergeLayers(this.base, this.overrides, { variables: this.variables }, this.currency, this.language);
	}

	public setCurrency(currency: Theme) {
		this.currency = currency;
	}

	public setLanguage(language: Theme) {
		this.language = language;
	}

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
	return deepmerge.all(layers, { arrayMerge: combineMerge, isMergeableObject: isPlainObject });
}

// TODO: verify this is needed
function combineMerge(target: any, source: any, options: any) {
	const destination = target.slice();
	source.forEach((item: any, index: any) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
		} else if (options.isMergeableObject(item)) {
			destination[index] = deepmerge(target[index], item, options);
		} else if (target.indexOf(item) === -1) {
			destination[index] = item;
		}
	});
	return destination;
}
