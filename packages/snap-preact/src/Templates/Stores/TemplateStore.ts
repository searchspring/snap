import { observable, makeObservable } from 'mobx';
import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { SnapTemplatesConfig } from '../SnapTemplate';
import { ThemeStore } from './ThemeStore';
import { TargetStore } from './TargetStore';
import { LibraryStore } from './LibraryStore';
import { debounce } from '@searchspring/snap-toolbox';
import type { DeepPartial } from '../../types';
import type { Theme, ThemeVariables } from '../../../components/src';

export type TemplateThemeTypes = 'library' | 'local';
export type TemplateTypes = 'search' | 'autocomplete' | 'recommendation';
export type TemplateTarget = {
	template: string;
	selector?: string;
	component?: string;
	theme?: string;
};

export type TemplatesStoreSettings = {
	editMode: boolean;
};

export type TemplatesStoreDependencies = {
	storage: StorageStore;
};

type WindowProperties = {
	innerWidth: number;
};

const RESIZE_DEBOUNCE = 10;
export class TemplatesStore {
	loading = false;
	config: SnapTemplatesConfig;
	storage: StorageStore;
	language: string;
	currency: string;
	settings: TemplatesStoreSettings;
	dependencies: TemplatesStoreDependencies;

	targets: {
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

	window: WindowProperties = { innerWidth: 0 };

	constructor(config: SnapTemplatesConfig, settings: TemplatesStoreSettings) {
		this.config = config;
		this.storage = new StorageStore({ type: StorageType.LOCAL, key: 'ss-templates' });

		this.dependencies = {
			storage: this.storage,
		};
		this.settings = settings;

		this.language = (this.settings.editMode && this.storage.get('language')) || this.config.config.language || 'en';
		this.currency = (this.settings.editMode && this.storage.get('currency')) || this.config.config.currency || 'usd';

		this.targets = {
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

		// configure window properties and add event listeners
		if (window) {
			this.setInnerWidth(window.innerWidth);
			const debouncedHandleResize = debounce(() => {
				this.setInnerWidth(window.innerWidth);
			}, RESIZE_DEBOUNCE);

			window.addEventListener('resize', debouncedHandleResize);
		}

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

				this.addTheme({ name: themeKey, type: 'local', base, overrides, variables, currency, language, innerWidth: this.window.innerWidth });
			});
		});

		makeObservable(this, {
			loading: observable,
			targets: observable,
			themes: observable,
		});
	}

	// TODO - rename to addTargeter / and change template - target(er) in SnapTemplate (config) and elsewhere
	public addTarget(type: TemplateTypes, target: TemplateTarget): string | undefined {
		const targetId = target.selector || target.component;
		if (targetId) {
			this.targets[type][targetId] = new TargetStore(target, this.dependencies, this.settings);
			return targetId;
		}
	}

	public getTarget(type: TemplateTypes, targetId: string) {
		return this.targets[type][targetId];
	}

	public addTheme(config: {
		name: string;
		type: TemplateThemeTypes;
		base: Theme;
		overrides?: DeepPartial<Theme>;
		variables?: DeepPartial<ThemeVariables>;
		currency: Partial<Theme>;
		language: Partial<Theme>;
		innerWidth?: number;
	}) {
		const theme = new ThemeStore(config, this.dependencies, this.settings);
		const themeLocation = this.themes[config.type as keyof typeof this.themes] || {};
		themeLocation[config.name] = theme;
	}

	private setInnerWidth(innerWidth: number) {
		if (this.window.innerWidth === innerWidth) return;

		this.window.innerWidth = innerWidth;
		for (const themeName in this.themes.local) {
			const theme = this.themes.local[themeName];
			theme.setInnerWidth(this.window.innerWidth);
		}
		for (const themeName in this.themes.library) {
			const theme = this.themes.library[themeName];
			theme.setInnerWidth(this.window.innerWidth);
		}
	}

	public async setCurrency(currencyCode: string) {
		if (currencyCode in this.library.import.currency) {
			await this.library.import.currency[currencyCode as keyof typeof this.library.import.currency]();
			const currency = this.library.locales.currencies[currencyCode];

			if (currency) {
				this.currency = currencyCode;
				this.storage.set('currency', this.currency);
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
				this.language = languageCode;
				this.storage.set('language', this.language);
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
		// preload the library
		this.loading = true;
		await this.library.preLoad();

		// build out the library themes
		this.themes.library = {};
		for (const themeName in this.library.themes) {
			const theme = this.library.themes[themeName];
			this.addTheme({
				name: themeName,
				type: 'library',
				base: theme,
				language: this.library.locales.languages[this.language],
				currency: this.library.locales.currencies[this.currency],
				innerWidth: this.window.innerWidth,
			});
		}
		this.loading = false;
	}
}
