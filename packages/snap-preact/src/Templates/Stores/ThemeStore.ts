// import { memo } from 'preact/compat';
// import { observable, makeObservable } from 'mobx';
import { Dependancies, combineMerge } from './TemplateStore';
import deepmerge from 'deepmerge';
import { Theme } from '@searchspring/snap-preact-components';
import { StorageStore } from '@searchspring/snap-store-mobx';
import { SnapTemplateConfig } from '../SnapTemplate';

/*
    {
        theme / merged - getter that combines all layers (momoized)
        base: {
            name: '',
            theme, // points to library theme layer (async)
        }
        variables: {
            theme, // project theme variables (not async)
        }
        overrides: {
            theme, // project theme overrides (not async)
        }
        currency: {
            set, // method to change the name/theme
            name: '',
            theme, // points to library theme layer (async)
        }
        language: {
            set, // method to change the name/theme
            name: '',
            theme, // points to library theme layer (async)
        }
        custom: {
            // editor overrides managed via the UI
            set, // method to set a key / value
            storage, // uses storage dependency
            theme, // custom override theme layer - modified using "set" (not async)
        }
        merge - method that takes any number of theme layers and collapses them together (deepmerge)
    }
*/

export class ThemeStore {
	isFromStorage: boolean;
	// language: {
	//     set: (language: string) => void;
	// } = {
	//     set: (language: string) => {
	//         this.language = language;
	//     }
	// };
	// currency: {
	//     set: (language: string) => {
	//         this.theme = library[language],
	//         // flag recompute of merged theme?
	//     },
	//     theme // points to the library currency overlay (theme layer)
	// };

	base: { name: string; theme: Promise<Theme> };
	overrides: { theme: Theme };
	variables: { theme: Theme };
	currency: { name: string; theme: Promise<Theme>; set: (cur: string) => void };
	language: { name: string; theme: Promise<Theme>; set: (lang: string) => void };
	custom: { storage: StorageStore; set: (path: string[], value: string) => void; theme: Theme };

	constructor(obj: { config: SnapTemplateConfig; themeName: string }, dependencies: Dependancies) {
		const { config, themeName } = obj;

		const themeConfig = config.config.themes![themeName];
		const { name, overrides, variables } = themeConfig;
		const themeVariables = variables || {};
		const themeOverrides = overrides || {};
		const themeCurrency = config.config.currency || 'en';
		const themeLanguage = config.config.language || 'usd';

		const storedOverrides = dependencies.storage.get(themeName);
		this.isFromStorage = Boolean(Object.keys(storedOverrides || {})?.length);
		this.overrides = storedOverrides || {};

		this.base = {
			name,
			theme: dependencies.library.themes[name](),
		};
		this.overrides = {
			theme: themeOverrides,
		};
		this.variables = {
			theme: themeVariables,
		};
		this.currency = {
			name: themeCurrency,
			theme: dependencies.library.locale.currency[themeCurrency as keyof typeof dependencies.library.locale.currency](),
			set: () => {
				// todo
			},
		};
		this.language = {
			name: themeLanguage,
			theme: dependencies.library.locale.language[themeLanguage as keyof typeof dependencies.library.locale.language](),
			set: () => {
				// todo
			},
		};
		this.custom = {
			// TODO
			storage: dependencies.storage,
			set: () => {
				// TODO
			},
			theme: {},
		};
	}

	public async merged(): Promise<Theme> {
		return this.mergeLayers(
			await this.base.theme,
			this.overrides.theme,
			this.variables.theme,
			await this.currency.theme,
			await this.language.theme,
			this.custom.theme
		);
	}

	public mergeLayers(...layers: Theme[]): Theme {
		// TODO: memoize
		return deepmerge.all(layers, { arrayMerge: combineMerge });
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
