import { observable, makeObservable } from 'mobx';
import deepmerge from 'deepmerge';
import { SnapTemplateConfig } from '../SnapTemplate';
import type { Theme } from '@searchspring/snap-preact-components';
import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { ThemeStore } from './ThemeStore';
import { TargetStore } from './TargetStore';
import { componentMap } from '../components';
import { themeMap } from '../themes';
import { localeMap } from '../locale';
/* classy store

	{
		config,
		templates: { //rename to targets
			search: { [targetId: string]: TargetStore }
			autocomplete: { [targetId: string]: TargetStore }
			recommendation: { [targetId: string]: TargetStore }
		},
		themes: {
			local: {
				[themeName: 'global' | string]: ThemeStore;
			}
			base: {
				[themeName: string]: ThemeStore;
			}
		},
		library: (LibraryStore) {
			themes: {
				[themeName in keyof typeof themeMap]?: Theme;
			};
			components: { // component map
				search: { [name: string]: () => Component }
				autocomplete: { [name: string]: () => Component }
				recommendation: { [name: string]: () => Component }
			};
			locales: { // locale map
				language: {
					en: { ... }
				},
				currency: {
					usd: { ... },
					eur: { ... },
				},
			}
		}
	}
	
*/

export type TemplateTypes = 'search' | 'autocomplete' | 'recommendation';

export type TemplateTheme = {
	isFromStorage: boolean;
	base: any;
	overrides: any;
	merged: any;
};

export type TemplateTarget = {
	template: string;
	selector?: string;
	component?: string;
	theme?: string;
	/*
		theme: {
			location: 'library' | 'local',
			name: string
		}
	*/
};

// export type Library = {
// 	themes: {
// 		[themeName in keyof typeof themeMap]: Promise<Theme>;
// 	};
// 	components: {
// 		[componentName in keyof typeof componentMap]: Promise<JSX.Element>;
// 	},
// 	locale: {
// 		currency: {
// 			[currencyName in keyof typeof localeMap.currency]: Promise<Theme>;
// 		},
// 		language: {
// 			[languageName in keyof typeof localeMap.language]: Promise<Theme>;
// 		}
// 	}
// }

export type Dependancies = {
	storage: StorageStore;
	library: typeof libraryImports;
};
export const GLOBAL_THEME_NAME = 'global';

const libraryImports = {
	themes: themeMap,
	components: componentMap,
	locale: localeMap,
};
export class TemplateStore {
	config: SnapTemplateConfig;
	storage: StorageStore;
	language: string; // TODO: type as keyof typeof languageMap
	currency: string; // TODO: type as keyof typeof currencyMap
	templates: {
		[key in TemplateTypes]: {
			[targetId: string]: TargetStore;
		};
	};
	themes: {
		local: {
			[themeName: 'global' | string]: ThemeStore;
		};
		library: {
			// [themeName in keyof typeof themeMap]: ThemeStore;
			[themeName: string]: ThemeStore;
		};
	};
	library = libraryImports;

	constructor(config: SnapTemplateConfig) {
		this.config = config;
		this.storage = new StorageStore({ type: StorageType.LOCAL, key: 'ss-templates' });

		this.language = this.config.config.language || 'en';
		this.currency = this.config.config.currency || 'usd';

		this.templates = {
			search: {},
			autocomplete: {},
			recommendation: {},
		};
		this.themes = {
			local: {},
			library: {},
		};

		// setup themes used by config
		if (config.config.themes)
			Object.keys(config.config.themes || {}).forEach((themeKey) => {
				const theme = config?.config?.themes![themeKey]; // TODO - fix
				// this.themes.library[theme.name] = this.themes.library[theme.name] || new ThemeStore({ config, themeName: theme.name,  })
				this.themes.local[themeKey] =
					this.themes.library[theme.name] || new ThemeStore({ config, themeName: themeKey }, { library: this.library, storage: this.storage });
				this.themes.local;
			});

		makeObservable(this, {
			templates: observable,
			themes: observable,
		});
	}

	public addTemplate(type: TemplateTypes, template: TemplateTarget): string | undefined {
		const targetId = template.selector || template.component;
		if (targetId) {
			this.templates[type][targetId] = new TargetStore(template, 'local');
			return targetId;
		}
	}

	public async getTemplate(type: TemplateTypes, targetId: string): Promise<{ Component: JSX.Element; theme?: Theme }> {
		const componentName = this.templates[type][targetId].template;
		const templateComponentTypes = this.library.components[type as keyof typeof this.library.components];
		const component = templateComponentTypes[componentName as keyof typeof templateComponentTypes];
		return {
			Component: component(),
		};
	}

	public async getTheme(type: TemplateTypes, targetId: string): Promise<{ Component?: JSX.Element; theme?: Theme }> {
		const themeName = this.templates[type][targetId].theme.name || GLOBAL_THEME_NAME;
		const theme = this.themes.local[themeName].merged();

		return {
			theme,
		};
	}

	// public async init() {
	// 	this.library.locale.currency[this.currency as keyof typeof this.library.locale.currency] = await this.imports.locales.currency[this.currency as keyof typeof this.imports.locales.currency]();
	// }

	// public async initialize() {
	// 	const themes = Object.keys(this.library.themes || {});
	// 	for (let i = 0; i < themes?.length; i++) {
	// 		const themeName = themes[i];
	// 		if (!this.library.themes[themeName as keyof typeof themeMap]) {
	// 			const libraryBaseTheme = await this.library.themes[themeName as keyof typeof themeMap]();
	// 			this.library.themes[themeName as keyof typeof themeMap] = deepFreeze(libraryBaseTheme);
	// 		}
	// 	}
	// }

	// only imports theme if a service is using that theme
	// public async importInitialThemes(snapConfig: SnapConfig) {
	// 	const controllerTypes = Object.keys(snapConfig.controllers || {});
	// 	for (let i = 0; i < controllerTypes?.length; i++) {
	// 		const controllerType = controllerTypes[i];
	// 		const controllers = snapConfig.controllers![controllerType as keyof typeof ControllerTypes] || [];
	// 		for (let j = 0; j < controllers?.length; j++) {
	// 			const controllerConfig = controllers[j];
	// 			for (let k = 0; k < (controllerConfig?.targeters || []).length; k++) {
	// 				const target = controllerConfig?.targeters && controllerConfig?.targeters[k];
	// 				const themeName = this.templates[target!.props!.type as TemplateTypes][target!.props!.targetId]?.theme.name;
	// 				await this.importTheme(themeName || GLOBAL_THEME_NAME);
	// 			}
	// 		}
	// 	}
	// }

	// public async importTheme(themeName: string): Promise<void> {
	// 	if ((!this.themes.local[themeName]) && this.config.config.themes && this.config.config.themes[themeName]) {
	// 		const themeConfig = this.config.config.themes![themeName];
	// 		const { name } = themeConfig;

	// 		if (this.library.themes[name as keyof typeof themeMap]) {
	// 			let libraryBaseTheme: Theme;

	// 			if (this.themes.library[name as keyof typeof themeMap]) {
	// 				libraryBaseTheme = this.themes.library[name as keyof typeof themeMap]!;
	// 			} else {
	// 				libraryBaseTheme = await this.library.themes[name as keyof typeof themeMap]();
	// 				this.library.themes[name as keyof typeof themeMap] = deepFreeze(libraryBaseTheme);
	// 			}

	// 			this.themes.local[themeName] = new ThemeStore({
	// 				config: this.config,
	// 				themeName,
	// 				libraryBaseTheme,
	// 			}, { storage: this.storage, library: this.library });
	// 		}
	// 	}
	// }

	// public setThemeOverrides(obj: { themeName: string; path: string[]; rootEditingKey: string; value: string }): void {
	// 	const { themeName, path, rootEditingKey, value } = obj;
	// 	this.themes.local[themeName].setOverride({
	// 		path,
	// 		rootEditingKey,
	// 		value,
	// 	});
	// }

	public changeCurrency(currency: string): void {
		this.currency = currency;
		// this.regenerateThemes();
	}

	public changeLanguage(language: string): void {
		this.language = language;
		// this.regenerateThemes();
	}

	// 	public changeTemplate(type: TemplateTypes, target: string, template: string): void {
	// 		this.templates[type][target].setTemplate(template);
	// 	}

	// 	public changeTheme(type: TemplateTypes, target: string, from: TargetLocation, theme: string): void {
	// 		this.templates[type][target].setTheme(theme, from);
	// 	}

	// 	public save(theme: string) {
	// 		const overrides = this.themes[theme].overrides;
	// 		this.storage.set(theme, overrides);
	// 	}

	// 	public removeFromStorage(theme: string) {
	// 		this.storage.set(theme, {});
	// 	}
}

// const deepFreeze = (obj: any) => {
// 	Object.keys(obj).forEach((prop) => {
// 		if (typeof obj[prop] === 'object') {
// 			deepFreeze(obj[prop]);
// 		}
// 	});
// 	return Object.freeze(obj);
// };

export const combineMerge = (target: any, source: any, options: any) => {
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
};

/*

TemplateStore Brainstorming
-----------------------------

TemplateStore = {
  global: {
		theme: {
			name: 'pike',
			base: {...}, // reference the library
			locale: {...}, // reference the libary
			variables: {...},
			overrides: {...},
		}
	},
	search: {
		templates: [
			{
				name: 'main',
				selector: '#searchspring-layout',
				template: 'Search',
				resultComponent: Result,
				theme: {
					name: 'bocachica',
					base: {...}, // reference the library
					locale: {...}, // reference the libary
					variables: {
						color: {
							primary: 'red',
							secondary: 'red',
							accent: 'red',
						},
					},
					overrides: {...},
				},
			},
		],
	},
	autocomplete: {
		templates: [...],
	},
	recommendation: {
		templates: [...],
	},

	// for reference when making selections
	library: {
		components: {
			templates: {
				search: {...},
				autocomplete: {...},
				recommendations: {...}
			}
		},
		locales: {...},
		themes: {...}
	}
}

*/
