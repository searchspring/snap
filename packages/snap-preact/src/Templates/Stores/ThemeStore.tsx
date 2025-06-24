import { h, render } from 'preact';
import { observable, makeObservable, toJS, computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import { StorageStore } from '@searchspring/snap-store-mobx';
import { TemplateThemeTypes, type TemplatesStoreConfigSettings, type TemplatesStoreDependencies } from './TemplateStore';
import { Global, css } from '@emotion/react';

import {
	ThemeMinimal,
	ThemeVariablesPartial,
	type Theme,
	ThemePartial,
	ThemeOverrides,
	ThemeVariableBreakpoints,
	ThemeComponents,
	ResponsiveKeys,
} from '../../../components/src';
import { CacheProvider } from '../../../components/src/providers/cache';
import { sortSelectors, filterSelectors } from '../../../components/src/utilities/mergeProps';
import type { GlobalThemeStyleScript } from '../../types';
import type { ListOption } from '../../../components/src/types';

export type ThemeStoreThemeConfig = {
	name: string;
	type: TemplateThemeTypes;
	base: Theme;
	overrides?: ThemeOverrides;
	variables?: ThemeVariablesPartial;
	currency: ThemeMinimal;
	language: ThemeMinimal;
	languageOverrides: ThemeMinimal;
	innerWidth?: number;
	style?: GlobalThemeStyleScript;
};

class SelectedLayout {
	public selected?: ListOption;
	private storage: StorageStore;
	private name: string;
	private type: string;

	public select(layout: ListOption) {
		this.selected = layout;
		this.storage.set(`themes.${this.type}.${this.name}.layout`, this.selected);
	}

	constructor(storageStore: StorageStore, name: string, type: string) {
		this.storage = storageStore;
		this.name = name;
		this.type = type;
		this.selected = this.storage.get(`themes.${this.type}.${this.name}.layout`);

		makeObservable(this, {
			selected: observable,
		});
	}
}

type ThemeStoreConfig = {
	config: ThemeStoreThemeConfig;
	dependencies: TemplatesStoreDependencies;
	settings: TemplatesStoreConfigSettings;
};

export class ThemeStore {
	public name: string;
	public type: string;
	public layout: SelectedLayout;

	private dependencies: TemplatesStoreDependencies;
	private base: Theme;
	private overrides: ThemeOverrides;
	variables: ThemeVariablesPartial;
	currency: ThemeMinimal;
	language: ThemeMinimal;
	languageOverrides: ThemeMinimal;
	stored: ThemePartial;
	innerWidth?: number;

	constructor(params: ThemeStoreConfig) {
		const { config, dependencies, settings } = params;
		this.dependencies = dependencies;

		const { name, style, type, base, overrides, variables, currency, language, languageOverrides, innerWidth } = config;

		// add prefixes to base theme components and responsive components
		base.components = prefixComponentKeys('*', base.components);
		if (base.responsive) {
			base.responsive.mobile = prefixComponentKeys('*(M)', base.responsive?.mobile);
			base.responsive.tablet = prefixComponentKeys('*(T)', base.responsive?.tablet);
			base.responsive.desktop = prefixComponentKeys('*(D)', base.responsive?.desktop);
		}

		if (overrides?.responsive) {
			overrides.responsive.mobile = prefixComponentKeys('(M)', overrides.responsive?.mobile);
			overrides.responsive.tablet = prefixComponentKeys('(T)', overrides.responsive?.tablet);
			overrides.responsive.desktop = prefixComponentKeys('(D)', overrides.responsive?.desktop);
		}

		this.name = name;
		this.type = type;
		this.base = base;
		this.layout = new SelectedLayout(this.dependencies.storage, this.name, this.type);
		this.overrides = overrides || {};
		this.variables = variables || {};
		this.currency = currency;
		this.language = language;
		this.languageOverrides = languageOverrides;
		this.stored = (settings.editMode && this.dependencies.storage.get(`themes.${this.type}.${this.name}.variables`)) || {};
		this.innerWidth = innerWidth;

		makeObservable(this, {
			name: observable,
			variables: observable,
			currency: observable,
			language: observable,
			stored: observable,
			innerWidth: observable,
			theme: computed, // make theme getter a computed property (memoized)
		});

		// handle adding the style to the document (should only happen once per theme)
		if (style) {
			const GlobalStyle = observer((props: any) => {
				const { self } = props;
				const theme = self.theme;
				const styles = css({
					[`.ss__theme__${theme.name}`]: style({ name: theme.name, variables: theme.variables }),
				});
				return (
					<CacheProvider>
						<Global styles={styles} />
					</CacheProvider>
				);
			});
			const styleElem = document.createElement('style');
			styleElem.innerHTML = `<!-- searchspring style injection point for "${this.name}" theme -->`;
			document.head.appendChild(styleElem);
			render(<GlobalStyle theme={this.theme} self={this} themeName={this.name} />, styleElem);
		}
	}

	public get theme(): Theme {
		/*
			Themes consist of layers which are deep merged together in order (last merge has highest priority)
				1. base theme
				2. base theme responsive breakpoints
				3. currency
				4. language
				5. language translation overrides
				6. theme overrides
				7. theme overrides at responsive breakpoints
				8. altered theme variables
				9. stored theme editor overrides
		*/

		const breakpoints = this.variables.breakpoints || this.base.variables?.breakpoints;

		const activeBreakpoint = getActiveBreakpoint(this.innerWidth, breakpoints);

		// overrides breakpoint is index file responsive overrides that match current breakpoint
		const overrideBreakpoint = getOverridesAtActiveBreakpoint(activeBreakpoint, this.innerWidth, this.overrides);

		// currently selected theme layer for current breakpoint
		const baseBreakpoint = getOverridesAtActiveBreakpoint(activeBreakpoint, this.innerWidth, this.base);
		// currently selected theme
		const base = { ...this.base };

		// overrides is index file default overrides
		const overrides = { ...this.overrides };

		const themeOverrides = mergeThemeLayers(overrides, overrideBreakpoint, {
			variables: toJS(this.variables),
		} as ThemePartial) as Theme;

		let theme: Theme = mergeThemeLayers(base, baseBreakpoint, this.currency, this.language, this.languageOverrides, themeOverrides, {
			activeBreakpoint: activeBreakpoint,
		}) as Theme;

		/*
			Ensure 'theme' prop has overrides applied to it
			- separate the "base" theme from "overrides"
			- inspect the "base" theme object for keys that have a 'theme' property
			- if the 'theme' property exists, merge overrides for matching keys in overrides
		*/

		// loop through all components
		for (const componentName in theme.components) {
			const component = theme.components[componentName as keyof typeof theme.components];
			const themeComponents = component?.theme?.components;
			// if a component has a theme property with components
			if (themeComponents) {
				for (const themeComponentName in themeComponents) {
					const themeComponentsApplicableSelectors = filterSelectors(themeOverrides.components || {}, `${componentName} ${themeComponentName}`).sort(
						sortSelectors
					);
					themeComponentsApplicableSelectors.forEach((selector) => {
						const themeComponentPropsOverrides = themeOverrides.components![selector as keyof typeof themeOverrides.components];
						if (themeComponentPropsOverrides) {
							const themeComponentProps = themeComponents[themeComponentName as keyof typeof themeComponents];
							// @ts-ignore - hard to type this
							themeComponents[themeComponentName as keyof typeof themeComponents] = { ...themeComponentProps, ...themeComponentPropsOverrides };
						}
					});
				}
			}
		}

		// TemplateEditor overrides
		if (this.stored) {
			theme = mergeThemeLayers(theme, this.stored) as Theme;
		}

		// change the theme name to match the ThemeStore theme name
		theme.name = this.name;
		return theme;
	}

	public setInnerWidth(innerWidth: number) {
		this.innerWidth = innerWidth;
	}

	public setCurrency(currency: ThemeMinimal) {
		this.currency = currency;
	}

	public setLanguage(language: ThemeMinimal) {
		this.language = language;
	}

	// removing a key from custom theme
	// public removeOverride(obj: { path: string[]; rootEditingKey: string; }) {
	// 	// TODO: remove key from stored
	// }

	// alternative to setOverride below...
	// public setOverrides(overrides: ThemeOverrides) {
	// 	this.stored = mergeThemeLayers(this.stored, overrides);
	// 	this.dependencies.storage.set(`themes.${this.type}.${this.name}.variables`, this.stored);
	// }

	// setting a key custom theme
	// TODO: any reason the rootEditingKey cannot be in the path?
	// maybe interface could be: setOverride(path, value);
	public setOverride(obj: { path: string[]; rootEditingKey: string; value: unknown }) {
		const { path, rootEditingKey, value } = obj;
		const overrides: ThemeOverrides = {
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
		this.stored = mergeThemeLayers(this.stored, overrides);
		this.dependencies.storage.set(`themes.${this.type}.${this.name}.variables`, this.stored);
	}
}

export function mergeThemeLayers(...layers: ThemePartial[]): ThemePartial {
	return deepmerge.all(layers, { arrayMerge: arrayMerge });
}

export function getActiveBreakpoint(width: number | undefined, breakpoints: ThemeVariableBreakpoints | undefined): ResponsiveKeys {
	let breakpoint: ResponsiveKeys | undefined;

	if (Number.isInteger(width) && breakpoints) {
		breakpoint = Object.keys(breakpoints).find((breakpoint) => width! <= breakpoints[breakpoint as keyof typeof breakpoints]) as ResponsiveKeys;
	}
	return breakpoint || 'default';
}

export function getOverridesAtActiveBreakpoint(activeBreakpoint: ResponsiveKeys, width: number | undefined, theme: ThemePartial): ThemePartial {
	let overrides: ThemePartial = {};

	if (width && Number.isInteger(width) && activeBreakpoint && theme.responsive) {
		overrides = (theme.responsive && (theme.responsive as any)[activeBreakpoint]) || {};
	}
	return { components: overrides };
}

const arrayMerge = (target: any, source: any, options: any) => {
	// trim off any excess array entries
	const destination = target.slice(0, source.length);

	source.forEach((item: any, index: any) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
		} else if (isPlainObject(item)) {
			destination[index] = deepmerge(target[index], item, options);
		} else {
			destination[index] = item;
		}
	});

	return destination;
};

function prefixComponentKeys(prefix: string, components?: ThemeComponents): ThemePartial {
	// TODO: remove any?
	const newComponents: any = {};

	if (components) {
		Object.keys(components).forEach((key) => {
			newComponents[`${prefix}${key}` as keyof typeof newComponents] = components![key as keyof typeof components];
		});
	}

	return newComponents;
}
