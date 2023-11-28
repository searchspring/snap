import { observable, makeObservable } from 'mobx';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import type { Theme, ThemeVariables } from '@searchspring/snap-preact-components';
import { TemplateThemeTypes, type TemplatesStoreSettings, type TemplatesStoreDependencies } from './TemplateStore';
import type { DeepPartial } from '../../types';

export class ThemeStore {
	dependencies: TemplatesStoreDependencies;
	name: string;
	type: string;
	base: Theme;
	overrides: DeepPartial<Theme>;
	variables: DeepPartial<ThemeVariables>;
	currency: Partial<Theme>;
	language: Partial<Theme>;
	stored: Partial<Theme>;

	constructor(
		config: {
			name: string;
			type: TemplateThemeTypes;
			base: Theme;
			overrides?: DeepPartial<Theme>;
			variables?: DeepPartial<ThemeVariables>;
			currency: Partial<Theme>;
			language: Partial<Theme>;
		},
		dependencies: TemplatesStoreDependencies,
		settings: TemplatesStoreSettings
	) {
		this.dependencies = dependencies;

		const { name, type, base, overrides, variables, currency, language } = config;
		this.name = name;
		this.type = type;
		this.base = base;
		this.overrides = overrides || {};
		this.variables = variables || {};
		this.currency = currency;
		this.language = language;
		this.stored = (settings.editMode && this.dependencies.storage.get(`themes.${this.type}.${this.name}`)) || {};

		makeObservable(this, {
			name: observable,
			base: observable,
			overrides: observable,
			variables: observable,
			currency: observable,
			language: observable,
			stored: observable,
		});
	}

	public get theme(): Theme {
		return mergeLayers(
			this.base,
			this.overrides as Partial<Theme>,
			{ variables: this.variables } as Partial<Theme>,
			this.currency,
			this.language,
			this.stored
		);
	}

	public setCurrency(currency: Partial<Theme>) {
		this.currency = currency;
	}

	public setLanguage(language: Partial<Theme>) {
		this.language = language;
	}

	// removing a key from custom theme
	// public removeOverride(obj: { path: string[]; rootEditingKey: string; }) {
	// 	// TODO: remove key from stored
	// }

	// setting a key custom theme
	public setOverride(obj: { path: string[]; rootEditingKey: string; value: string }) {
		const { path, rootEditingKey, value } = obj;
		const overrides = {
			[rootEditingKey]: path.reverse().reduce((res, key) => {
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
		this.stored = mergeLayers(this.stored, overrides);
		this.dependencies.storage.set(`themes.${this.type}.${this.name}`, this.stored);
	}
}

function mergeLayers(...layers: Partial<Theme>[]): Partial<Theme> {
	// TODO: memoize
	return deepmerge.all(layers, { isMergeableObject: isPlainObject });
}
