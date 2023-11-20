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

type Library = {
	themes: {
		[themeName: string]: Theme;
	};
	components: {
		[componentName: string]: JSX.Element;
	};
	locale: {
		currency: {
			[currencyName: string]: Partial<Theme>;
		};
		language: {
			[languageName: string]: Partial<Theme>;
		};
	};
};

export type Dependancies = {
	storage: StorageStore;
};
export const GLOBAL_THEME_NAME = 'global';

const libraryImports = {
	themes: themeMap,
	components: componentMap,
	locale: localeMap,
};
export class TemplateStore {
	config: SnapTemplateConfig;
	isEditorMode: boolean;
	storage: StorageStore;
	language: string;
	currency: string;

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
			[themeName: string]: ThemeStore;
		};
	};

	library: Library = {
		themes: {},
		components: {},
		locale: {
			currency: {},
			language: {},
		},
	};

	constructor(config: SnapTemplateConfig, isEditorMode: boolean) {
		this.isEditorMode = isEditorMode;
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

		/* Setup Themes */
		const baseThemeNames = Object.keys(config.config.themes || {}).map((themeKey) => {
			const theme = config?.config?.themes![themeKey];
			return theme.name;
		});
		const uniqueBaseThemeNames = Array.from(new Set(baseThemeNames)); // ['bocachica']

		const importPromises = [];
		importPromises.push(libraryImports.locale.currency[this.currency as keyof typeof libraryImports.locale.currency]());
		importPromises.push(libraryImports.locale.language[this.language as keyof typeof libraryImports.locale.language]());

		uniqueBaseThemeNames.forEach((baseThemeName) => {
			// import theme
			importPromises.push(themeMap[baseThemeName]());
		});

		// create theme stores from objects
		Promise.all(importPromises).then((importResolutions) => {
			const [importedCurrency, importedLanguage, ...themes] = importResolutions;

			// put locales into library
			this.library.locale.currency[this.currency as keyof typeof this.library.locale.currency] = importedCurrency as Partial<Theme>;
			this.library.locale.language[this.language as keyof typeof this.library.locale.language] = importedLanguage as Partial<Theme>;

			// put themes into library
			themes.forEach((theme, index) => (this.library.themes[uniqueBaseThemeNames[index]] = theme as Theme));

			// create theme stores
			Object.keys(config.config.themes!).forEach((name) => {
				// ['global', 'boca1']
				const theme = config.config.themes![name];
				const libraryBaseThemeName = theme.name;

				const base = this.library.themes[libraryBaseThemeName];
				const overrides = theme.overrides || {};
				const variables = theme.variables || {};
				const currency = this.library.locale.currency[this.currency as keyof typeof this.library.locale.currency];
				const language = this.library.locale.language[this.language as keyof typeof this.library.locale.language];

				this.themes.local[name] = new ThemeStore({ name, base, overrides, variables, currency, language }, { storage: this.storage });
			});

			// trigger mobx
			this.themes = {
				...this.themes,
			};
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

	public getTemplate(type: TemplateTypes, targetId: string): any {
		const themeName = this.templates[type][targetId].theme.name || GLOBAL_THEME_NAME;
		// const location = this.templates[type][targetId].theme.location;

		return {
			template: this.templates[type][targetId].template,
			theme: this.themes.local[themeName as keyof typeof this.themes.local]?.theme,
		};
	}

	public async initializeEditor() {
		// fetch all themes to the library
		// fetch all locales to the library
		// create library theme stores

		const themes = Object.keys(themeMap || {});
		for (let i = 0; i < themes?.length; i++) {
			const themeName = themes[i];
			if (!this.library.themes[themeName as keyof typeof themeMap]) {
				await this.loadTheme(themeName);
				// new ThemeStore
				// this.themes.library = new ThemeStore()
			}
		}

		// importPromises.push(libraryImports.locale.currency[this.currency as keyof typeof libraryImports.locale.currency]());
	}

	public async loadTheme(themeName: string) {
		if (!this.library.themes[themeName]) {
			const libraryBaseTheme = await themeMap[themeName as keyof typeof themeMap]();
			this.library.themes[themeName as keyof typeof themeMap] = libraryBaseTheme;
		}
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
