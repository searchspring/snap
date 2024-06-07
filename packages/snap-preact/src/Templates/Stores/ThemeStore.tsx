import { h, render } from 'preact';
import { observable, makeObservable } from 'mobx';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import { StorageStore } from '@searchspring/snap-store-mobx';
import { TemplateThemeTypes, type TemplatesStoreSettings, type TemplatesStoreDependencies } from './TemplateStore';
import { Global, css } from '@emotion/react';

import type { Theme, ThemeVariables } from '../../../components/src';
import type { DeepPartial, GlobalThemeStyleScript } from '../../types';
import type { ListOption } from '../../../components/src/types';
import { observer } from 'mobx-react';

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

export class ThemeStore {
	public name: string;
	public type: string;
	public layout: SelectedLayout;

	private dependencies: TemplatesStoreDependencies;
	private base: Theme;
	private overrides: DeepPartial<Theme>;
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
			style?: GlobalThemeStyleScript;
		},
		dependencies: TemplatesStoreDependencies,
		settings: TemplatesStoreSettings
	) {
		this.dependencies = dependencies;

		const { name, style, type, base, overrides, variables, currency, language, innerWidth } = config;
		this.name = name;
		this.type = type;
		this.base = base;
		this.layout = new SelectedLayout(this.dependencies.storage, this.name, this.type);
		this.overrides = overrides || {};
		this.variables = variables || {};
		this.currency = currency;
		this.language = language;
		this.stored = (settings.editMode && this.dependencies.storage.get(`themes.${this.type}.${this.name}.variables`)) || {};
		this.innerWidth = innerWidth;

		makeObservable(this, {
			name: observable,
			variables: observable,
			currency: observable,
			language: observable,
			stored: observable,
			innerWidth: observable,
		});
		if (style) {
			// const theme = this.theme;
			const GlobalStyle = observer((props: any) => {
				const { self } = props;
				const theme = self.theme;
				const styles = css(style({ name: theme.name, variables: theme.variables }));

				return <Global styles={styles} />;
			});
			// TODO: when using the template editor and switching themes, the global styles still remain
			render(<GlobalStyle self={this} />, document.body);
		}
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

		let theme = mergeLayers(
			this.base,
			baseBreakpoint,
			this.currency,
			this.language,
			this.overrides as Partial<Theme>,
			overrideBreakpoint,
			{ variables: this.variables } as Partial<Theme>,
			this.stored
		);

		const layoutOptions = theme.layoutOptions;
		const selectedOption: ListOption | undefined =
			layoutOptions?.find((option) => option?.value === this.layout.selected?.value) ||
			layoutOptions?.find((option) => option?.default) ||
			(Array.isArray(layoutOptions) ? layoutOptions[0] : undefined);

		if (selectedOption?.overrides) {
			theme = mergeLayers(theme, selectedOption.overrides as Partial<Theme>);

			// if the the selectedOption differs from this.layout.selected, then select the layout
			if (
				!this?.layout?.selected ||
				(this?.layout?.selected && selectedOption.value !== this.layout.selected.value && selectedOption.label !== this.layout.selected.label)
			) {
				this.layout.select(selectedOption);
			}
		}

		// change the theme name to match the ThemeStore theme name
		theme.name = this.name;
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
		this.dependencies.storage.set(`themes.${this.type}.${this.name}.variables`, this.stored);
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
