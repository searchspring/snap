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
	innerWidth?: number;

	constructor(
		config: {
			name: string;
			type: TemplateThemeTypes;
			base: Theme;
			overrides?: DeepPartial<Theme>;
			variables?: DeepPartial<ThemeVariables>;
			currency: Partial<Theme>;
			language: Partial<Theme>;
			innerWidth?: number;
		},
		dependencies: TemplatesStoreDependencies,
		settings: TemplatesStoreSettings
	) {
		this.dependencies = dependencies;

		const { name, type, base, overrides, variables, currency, language, innerWidth } = config;
		this.name = name;
		this.type = type;
		this.base = base;
		this.overrides = overrides || {};
		this.variables = variables || {};
		this.currency = currency;
		this.language = language;
		this.stored = (settings.editMode && this.dependencies.storage.get(`themes.${this.type}.${this.name}`)) || {};
		this.innerWidth = innerWidth;

		makeObservable(this, {
			name: observable,
			variables: observable,
			currency: observable,
			language: observable,
			stored: observable,
			innerWidth: observable,
		});
	}

	public get theme(): Theme {
		let baseBreakpoint = {};
		let overrideBreakpoint = {};
		if (this.innerWidth && Number.isInteger(this.innerWidth)) {
			const breakpoints = (this.variables.breakpoints || this.base.variables?.breakpoints) as number[];
			const breakpoint = breakpoints.find((breakpoint) => this.innerWidth! < breakpoint);

			if (breakpoint) {
				const breakpointIndex = breakpoints.indexOf(breakpoint);
				const responsiveIndex = Math.max(breakpointIndex - 1, 0); // index 0 also applies to under first breakpoint
				baseBreakpoint = (this.base?.responsive && (this.base?.responsive as any)[responsiveIndex]) || {};
				overrideBreakpoint = (this.overrides?.responsive && (this.overrides?.responsive as any)[responsiveIndex]) || {};
			} else if (this.innerWidth >= breakpoints[breakpoints.length - 1]) {
				// if innerWidth is greater than the last breakpoint, use the last breakpoint
				const responsiveIndex = breakpoints.length - 1;
				baseBreakpoint = (this.base?.responsive && (this.base?.responsive as any)[responsiveIndex]) || {};
				overrideBreakpoint = (this.overrides?.responsive && (this.overrides?.responsive as any)[responsiveIndex]) || {};
			}
		}

		const theme = mergeLayers(
			this.base,
			baseBreakpoint,
			this.currency,
			this.language,
			this.overrides as Partial<Theme>,
			overrideBreakpoint,
			{ variables: this.variables } as Partial<Theme>,
			this.stored
		);
		return theme;
	}

	public setInnerWidth(innerWidth: number) {
		this.innerWidth = innerWidth;
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
	return deepmerge.all(layers, { isMergeableObject: isPlainObject, arrayMerge: combineMerge });
}

const combineMerge = (target: any, source: any, options: any) => {
	const destination = target.slice();
	source.forEach((item: any, index: any) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
		} else if (options.isMergeableObject(item)) {
			destination[index] = deepmerge(target[index], item, options);
		} else if (target.indexOf(item) === -1) {
			destination.push(item);
		}
	});
	return destination;
};
