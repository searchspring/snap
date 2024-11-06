import { observable, makeObservable } from 'mobx';
import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { SnapTemplatesConfig } from '../SnapTemplates';
import { ThemeStore, ThemeStoreThemeConfig } from './ThemeStore';
import { TargetStore } from './TargetStore';
import { CurrencyCodes, LanguageCodes, LibraryImports, LibraryStore } from './LibraryStore';
import { debounce } from '@searchspring/snap-toolbox';
import type { ShopifyPluginMutateResultsConfig } from '@searchspring/snap-platforms/shopify';
import type { CommonPluginBackgroundFilterConfig } from '@searchspring/snap-platforms/common';
import type { CommonPluginScrollToTopConfig } from '@searchspring/snap-platforms/common';
import type {
	LangComponentOverrides,
	ResultComponent,
	ThemeComponents,
	ThemeMinimal,
	ThemeOverrides,
	ThemeVariablesPartial,
} from '../../../components/src';
import type { GlobalThemeStyleScript, IntegrationPlatforms } from '../../types';

export type TemplateThemeTypes = 'library' | 'local';
export type TemplateTypes = 'search' | 'autocomplete' | `recommendation/${RecsTemplateTypes}`;
export type TemplateCustomComponentTypes = 'result' | 'badge';
export type RecsTemplateTypes = 'bundle' | 'default' | 'email';

type TargetMap = { [targetId: string]: TargetStore };

type ComponentLibraryType =
	| keyof LibraryImports['component']['autocomplete']
	| keyof LibraryImports['component']['search']
	| keyof LibraryImports['component']['recommendation']['default']
	| keyof LibraryImports['component']['recommendation']['bundle']
	| keyof LibraryImports['component']['recommendation']['email'];

export type TemplateTarget = {
	selector?: string;
	theme?: keyof LibraryImports['theme'] | (string & NonNullable<unknown>);
	component: ComponentLibraryType | (string & NonNullable<unknown>);
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
};

export type TemplatesStoreConfigSettings = {
	editMode: boolean;
};

export type TemplatesStoreDependencies = {
	storage: StorageStore;
};

type WindowProperties = {
	innerWidth: number;
};

type TemplateStoreThemeConfig = {
	extends: keyof LibraryImports['theme'];
	style?: GlobalThemeStyleScript;
	resultComponent?: keyof LibraryImports['component']['result'] | (string & NonNullable<unknown>);
	variables?: ThemeVariablesPartial;
	overrides?: ThemeOverrides;
};

export type TemplateStoreComponentConfig = {
	[key in TemplateCustomComponentTypes]?: {
		[componentName: string]: (args?: any) => Promise<ResultComponent> | ResultComponent;
	};
};

export type CommonPlugins = {
	backgroundFilters?: CommonPluginBackgroundFilterConfig;
	scrollToTop?: CommonPluginScrollToTopConfig;
};
export type ShopifyPlugins = {
	mutateResults?: ShopifyPluginMutateResultsConfig;
};

export type TemplatesStoreConfigConfig = {
	components?: TemplateStoreComponentConfig;
	config: {
		siteId?: string;
		currency?: CurrencyCodes;
		language?: LanguageCodes;
		platform: IntegrationPlatforms;
	};
	plugins?: {
		common?: CommonPlugins;
		shopify?: ShopifyPlugins;
	};
	translations?: {
		[currencyName in LanguageCodes]?: LangComponentOverrides;
	};
	themes: {
		global: TemplateStoreThemeConfig;
	} & { [themeName: string]: TemplateStoreThemeConfig };
};

const RESIZE_DEBOUNCE = 100;

export type TemplatesStoreConfig = {
	config: TemplatesStoreConfigConfig;
	settings?: TemplatesStoreConfigSettings;
};

export class TemplatesStore {
	loading = false;
	config: SnapTemplatesConfig;
	storage: StorageStore;
	language: LanguageCodes;
	currency: CurrencyCodes;
	platform: IntegrationPlatforms;
	settings: TemplatesStoreConfigSettings;
	dependencies: TemplatesStoreDependencies;

	targets: {
		search: TargetMap;
		autocomplete: TargetMap;
		recommendation: {
			[key in RecsTemplateTypes]: TargetMap;
		};
	};

	themes: {
		local: {
			[themeName: string]: ThemeStore;
		};
		library: {
			[themeName: string]: ThemeStore;
		};
	};

	library: LibraryStore;

	window: WindowProperties = { innerWidth: 0 };

	constructor(params: TemplatesStoreConfig) {
		const { config, settings } = params || {};
		this.config = config;

		this.platform = config.config.platform || 'other';

		this.storage = new StorageStore({ type: StorageType.local, key: 'ss-templates' });

		this.dependencies = {
			storage: this.storage,
		};
		this.settings = settings || { editMode: false };

		this.targets = {
			search: {},
			autocomplete: {},
			recommendation: {
				bundle: {},
				default: {},
				email: {},
			},
		};

		this.themes = {
			local: {},
			library: {},
		};

		this.library = new LibraryStore({ components: config.components });

		this.language =
			(this.settings.editMode && this.storage.get('language')) ||
			(this.config.config?.language && this.config.config.language in this.library.import.language && this.config.config.language) ||
			'en';
		this.currency =
			(this.settings.editMode && this.storage.get('currency')) ||
			(this.config.config?.currency && this.config.config.currency in this.library.import.currency && this.config.config.currency) ||
			'usd';

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

		// theme loading promise
		this.loading = true;
		const themePromises: Promise<void>[] = [];

		// setup local themes
		Object.keys(config.themes).map((themeKey) => {
			const themeConfig = config.themes[themeKey];
			// add promise
			const themeDefer = new Deferred();
			themePromises.push(themeDefer.promise);

			// import component if defined
			if (themeConfig.resultComponent && this.library.import.component.result[themeConfig.resultComponent]) {
				this.library.import.component.result[themeConfig.resultComponent]();
			}

			// import theme dependencies
			const themeImports = [importCurrency, importLanguage, this.library.import.theme[themeConfig.extends]()];

			Promise.all(themeImports).then(() => {
				const base = this.library.themes[themeConfig.extends];
				const overrides = themeConfig.overrides || {};
				const variables = themeConfig.variables || {};
				const currency = this.library.locales.currencies[this.currency] || {};
				const language = this.library.locales.languages[this.language] || {};
				const languageOverrides = transformTranslationsToTheme((this.config.translations && this.config.translations[this.language]) || {});

				this.addTheme({
					name: themeKey,
					style: themeConfig.style,
					type: 'local',
					base,
					overrides,
					variables,
					currency,
					language,
					languageOverrides,
					innerWidth: this.window.innerWidth,
				});

				themeDefer.resolve();
			});
		});

		Promise.all(themePromises).then(() => {
			this.loading = false;
		});

		makeObservable(this, {
			loading: observable,
			targets: observable,
			themes: observable,
		});
	}

	public addTarget(type: TemplateTypes, target: TemplateTarget): string | undefined {
		const targetId = target.selector || target.component;
		if (targetId) {
			const path = type.split('/');
			let targetPath: any = this.targets;
			for (let index = 0; index < path.length; index++) {
				if (!targetPath[path[index]]) {
					return;
				}
				targetPath = targetPath[path[index]];
			}
			(targetPath as TargetMap)[targetId] = new TargetStore({
				target,
				dependencies: this.dependencies,
				settings: this.settings,
			});

			if (this.settings.editMode) {
				// triggers a rerender for TemplateEditor
				this.targets = { ...this.targets };
			}
			return targetId;
		}
	}

	public getTarget(type: TemplateTypes, targetId: string): TargetStore | undefined {
		const path = type.split('/');
		path.push(targetId);
		let targetPath: any = this.targets;
		for (let index = 0; index < path.length; index++) {
			if (!targetPath[path[index]]) {
				return;
			}
			targetPath = targetPath[path[index]];
		}

		return targetPath;
	}

	public addTheme(config: ThemeStoreThemeConfig) {
		const theme = new ThemeStore({
			config,
			dependencies: this.dependencies,
			settings: this.settings,
		});
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

	public getThemeStore(themeName?: string): ThemeStore | undefined {
		if (themeName) {
			return this.themes.local[themeName] || this.themes.library[themeName];
		}
	}

	public async setCurrency(currencyCode: CurrencyCodes) {
		if (currencyCode in this.library.import.currency) {
			await this.library.import.currency[currencyCode]();
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

	public async setLanguage(languageCode: LanguageCodes) {
		if (languageCode in this.library.import.language) {
			await this.library.import.language[languageCode]();
			const language = this.library.locales.languages[languageCode];

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
				language: this.library.locales.languages[this.language] || {},
				languageOverrides: transformTranslationsToTheme((this.config.translations && this.config.translations[this.language]) || {}),
				currency: this.library.locales.currencies[this.currency] || {},
				innerWidth: this.window.innerWidth,
			});
		}
		this.loading = false;
	}
}

export function transformTranslationsToTheme(translations: LangComponentOverrides): ThemeMinimal {
	const components: Partial<ThemeComponents> = {};

	Object.keys(translations).forEach((component) => {
		components[component as keyof typeof components] = {
			// @ts-ignore - don't know which component it may be
			lang: translations[component as keyof typeof translations],
		};
	});

	return {
		components,
	};
}

class Deferred {
	promise: Promise<any>;
	resolve: any;
	reject: any;

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}
}
