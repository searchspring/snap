import { observable, makeObservable } from 'mobx';
import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { SnapTemplatesConfig } from '../SnapTemplate';
import { ThemeStore } from './ThemeStore';
import { TargetStore } from './TargetStore';
import { LibraryStore } from './LibraryStore';

import type { Theme } from '@searchspring/snap-preact-components';
export type TemplateThemeTypes = 'library' | 'local';
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

export class TemplatesStore {
	config: SnapTemplatesConfig;
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
		library?: {
			[themeName: string]: ThemeStore;
		};
	};

	library: LibraryStore;

	constructor(config: SnapTemplatesConfig, isEditorMode: boolean) {
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
		};

		this.library = new LibraryStore();

		// import locale selections
		const importCurrency = this.library.import.currency[this.currency as keyof typeof this.library.import.currency]();
		const importLanguage = this.library.import.language[this.language as keyof typeof this.library.import.language]();

		// setup local themes
		Object.keys(config.config.themes).map((themeKey) => {
			const theme = config.config.themes[themeKey];
			const imports = [importCurrency, importLanguage, this.library.import.theme[theme.name]()];

			Promise.all(imports).then(() => {
				const base = this.library.themes[theme.name];
				const overrides = theme.overrides || {};
				const variables = theme.variables || {};
				const currency = this.library.locales.currencies[this.currency];
				const language = this.library.locales.languages[this.language];

				this.addTheme({ name: themeKey, type: 'local', base, overrides, variables, currency, language });
			});
		});

		/* Setup Themes */
		// const baseThemeNames = Object.keys(config.config.themes || {}).map((themeKey) => {
		// 	const theme = config?.config?.themes![themeKey];
		// 	return theme.name;
		// });
		// const uniqueBaseThemeNames = Array.from(new Set(baseThemeNames)); // ['bocachica']

		// const importPromises = [];
		// importPromises.push(libraryImports.locale.currency[this.currency as keyof typeof libraryImports.locale.currency]());
		// importPromises.push(libraryImports.locale.language[this.language as keyof typeof libraryImports.locale.language]());

		// uniqueBaseThemeNames.forEach((baseThemeName) => {
		// 	// import theme
		// 	importPromises.push(themeMap[baseThemeName]());
		// });

		// // create theme stores from objects
		// Promise.all(importPromises).then((importResolutions) => {
		// 	const [importedCurrency, importedLanguage, ...themes] = importResolutions;

		// 	// put locales into library
		// 	this.library.locale.currency[this.currency as keyof typeof this.library.locale.currency] = importedCurrency as Partial<Theme>;
		// 	this.library.locale.language[this.language as keyof typeof this.library.locale.language] = importedLanguage as Partial<Theme>;

		// 	// put themes into library
		// 	themes.forEach((theme, index) => (this.library.themes[uniqueBaseThemeNames[index]] = theme as Theme));

		// 	// create theme stores
		// 	Object.keys(config.config.themes!).forEach((name) => {
		// 		// ['global', 'boca1']
		// 		const theme = config.config.themes![name];
		// 		const libraryBaseThemeName = theme.name;

		// 		const base = this.library.themes[libraryBaseThemeName];
		// 		const overrides = theme.overrides || {};
		// 		const variables = theme.variables || {};
		// 		const currency = this.library.locale.currency[this.currency as keyof typeof this.library.locale.currency];
		// 		const language = this.library.locale.language[this.language as keyof typeof this.library.locale.language];

		// 		this.themes.local[name] = new ThemeStore({ name, base, overrides, variables, currency, language }, { storage: this.storage });
		// 	});

		// 	// trigger mobx
		// 	this.themes = {
		// 		...this.themes,
		// 	};
		// });

		makeObservable(this, {
			templates: observable,
			themes: observable,
		});
	}

	// TODO - rename to addTargeter / and change template - target(er) in SnapTemplate (config) and elsewhere
	public addTemplate(type: TemplateTypes, template: TemplateTarget): string | undefined {
		const targetId = template.selector || template.component;
		if (targetId) {
			this.templates[type][targetId] = new TargetStore(template, 'local');
			return targetId;
		}
	}

	public getTargeter(type: TemplateTypes, targetId: string) {
		return this.templates[type][targetId];
	}

	// { name: themeKey, type: 'local', base, overrides, variables, currency, language }
	public addTheme(config: {
		name: string;
		type: TemplateThemeTypes;
		base: Theme;
		overrides?: Theme;
		variables?: Theme;
		currency: Theme;
		language: Theme;
	}) {
		const theme = new ThemeStore(config, { storage: this.storage });
		const themeLocation = this.themes[config.type as keyof typeof this.themes] || {};
		themeLocation[config.name] = theme;
	}

	public async setCurrency(currencyCode: string) {
		if (currencyCode in this.library.import.currency) {
			await this.library.import.currency[currencyCode as keyof typeof this.library.import.currency]();
			const currency = this.library.locales.currencies[currencyCode];

			if (currency) {
				console.log('changing currency!!!', currencyCode);
				this.currency = currencyCode;
				for (const themeName in this.themes.local) {
					const theme = this.themes.local[themeName];
					theme.setCurrency(currency);
				}
				for (const themeName in this.themes.library) {
					const theme = this.themes.library[themeName];
					theme.setCurrency(currency);
				}
			}
		}
	}

	public async setLanguage(languageCode: string) {
		if (languageCode in this.library.import.language) {
			await this.library.import.language[languageCode as keyof typeof this.library.import.language]();
			const language = this.library.locales.currencies[languageCode];

			if (language) {
				console.log('changing language!!!', languageCode);
				this.language = languageCode;
				for (const themeName in this.themes.local) {
					const theme = this.themes.local[themeName];
					theme.setLanguage(language);
				}
				for (const themeName in this.themes.library) {
					const theme = this.themes.library[themeName];
					theme.setLanguage(language);
				}
			}
		}
	}

	public async preLoad() {
		await this.library.preLoad();

		this.themes.library = {};
		for (const themeName in this.library.themes) {
			const theme = this.library.themes[themeName];
			this.addTheme({
				name: themeName,
				type: 'library',
				base: theme,
				language: this.library.locales.languages[this.language],
				currency: this.library.locales.currencies[this.currency],
			});
		}
	}
}
