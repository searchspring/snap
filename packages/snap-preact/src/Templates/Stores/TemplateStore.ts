import { observable, makeObservable } from 'mobx';
import deepmerge from 'deepmerge';
import { SnapTemplateConfig } from '../SnapTemplate';
import { themeMap } from '../themes/index';
import type { Theme } from '@searchspring/snap-preact-components';
import type { SnapConfig } from '../../Snap';
import { ControllerTypes } from '@searchspring/snap-controller';
import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';

/* config defined themes
		themes: {
			global: MergedTheme,
			boca1: MergedTheme,
		}

		locale: {
			language: 'en',
			currency: 'usd',
		}
		themes: {
			global: {
				base: merge(library.themes[name], themeVariables, themeOverrides) // only have to have merged this on init
				overrides: { variables: {} }, // editor overrides
				merged: merge(this.base, library.locales.language['en'], library.locales.currency['usd'], editorOverrides) // lastest merge
			},
			boca1: {
				base: merge(library.themes[name], themeVariables, themeOverrides) // only have to have merged this on init

				// initial themeVariables
				// initial themeOverrides
				
				overrides: { variables: {} }, // editor overrides
				merged: merge(this.base, editorOverrides) // lastest merge
			}
		}

		library: ThemeLibrary = {}

		MergedTheme = merge(baseTheme, themeVariables, themeOverrides, localeOverides, editorOverrides)
	*/

type TemplateTypes = 'search' | 'autocomplete' | 'recommendation';

type TemplateTheme = {
	isFromStorage: boolean;
	base: any;
	overrides: any;
	merged: any;
};

const GLOBAL_THEME_NAME = 'global';
export class TemplateStore {
	config: SnapTemplateConfig;
	storage: StorageStore;
	language: string; // TODO: type as keyof typeof languageMap
	currency: string; // TODO: type as keyof typeof currencyMap
	themeMap: { [key in keyof typeof themeMap]: () => Promise<Theme> } = themeMap;
	templates: {
		[key in TemplateTypes]: {
			[targetId: string]: string;
		};
	};
	themes: {
		[themeName: 'global' | string]: TemplateTheme;
	};
	library: {
		themes: {
			[themeName in keyof typeof themeMap]?: Theme;
		};
		components: {
			templates: {
				[key in TemplateTypes]?: string[];
			};
		};
		locales: any;
	};

	constructor(config: SnapTemplateConfig) {
		this.config = config;
		this.storage = new StorageStore({ type: StorageType.LOCAL, key: 'ss-theme-overrides' });
		this.language = this.config.config.language || 'en';
		this.currency = this.config.config.currency || 'usd';

		this.templates = {
			search: {},
			autocomplete: {},
			recommendation: {},
		};
		this.themes = {};

		this.library = {
			components: {
				templates: {
					search: ['Search', 'SearchTest'],
					autocomplete: ['Autocomplete'],
					recommendation: ['Recommendation'],
				},
			},
			locales: {
				language: {
					en: {
						components: {
							filterSummary: {
								title: 'Current Filters Custom',
								clearAllLabel: 'Clear All Custom',
							},
						},
					},
				},
				currency: {
					usd: {
						components: {
							price: {
								symbol: '$',
							},
						},
					},
					eur: {
						components: {
							price: {
								symbol: '€',
							},
						},
					},
				},
			},
			themes: {},
		};

		makeObservable(this, {
			templates: observable,
			themes: observable,
		});
	}

	public addTemplate(type: TemplateTypes, template: { template: string; selector?: string; component?: string; theme?: string }): string | undefined {
		const targetId = template.selector || template.component;
		if (targetId) {
			this.templates[type][targetId] = template.template;
			return targetId;
		}
	}

	public getTemplate(type: TemplateTypes, targetId: string, themeName: string): any {
		return {
			template: this.templates[type][targetId],
			theme: this.themes[themeName || GLOBAL_THEME_NAME]?.merged || {},
		};
	}

	// only imports theme if a service is using that theme
	public async importInitialThemes(snapConfig: SnapConfig) {
		const controllerTypes = Object.keys(snapConfig.controllers || {});
		for (let i = 0; i < controllerTypes?.length; i++) {
			const controllerType = controllerTypes[i];
			const controllers = snapConfig.controllers![controllerType as keyof typeof ControllerTypes] || [];
			for (let j = 0; j < controllers?.length; j++) {
				const controllerConfig = controllers[j];
				for (let k = 0; k < (controllerConfig?.targeters || []).length; k++) {
					const target = controllerConfig?.targeters && controllerConfig?.targeters[k];
					await this.importTheme(target?.props?.themeName || GLOBAL_THEME_NAME);
				}
			}
		}
	}

	public async importTheme(themeName: string): Promise<void> {
		if (!this.themes[themeName] && this.config.config.themes && this.config.config.themes[themeName]) {
			const themeConfig = this.config.config.themes![themeName];
			const { name, overrides, variables } = themeConfig;

			if (this.themeMap[name as keyof typeof themeMap]) {
				let libraryBaseTheme: Theme;

				if (this.library.themes[name as keyof typeof themeMap]) {
					libraryBaseTheme = this.library.themes[name as keyof typeof themeMap]!;
				} else {
					libraryBaseTheme = await this.themeMap[name as keyof typeof themeMap]();
					this.library.themes[name as keyof typeof themeMap] = deepFreeze(libraryBaseTheme);
				}

				const themeVariables = variables || this.config.config.themes![GLOBAL_THEME_NAME].variables || {};
				const themeOverrides = overrides || this.config.config.themes![GLOBAL_THEME_NAME].overrides || {};

				const base = deepmerge(libraryBaseTheme, deepmerge({ variables: themeVariables }, themeOverrides, { arrayMerge: combineMerge }), {
					arrayMerge: combineMerge,
				});

				const merged = deepmerge(
					base,
					deepmerge(this.library.locales.language[this.language], this.library.locales.currency[this.currency], { arrayMerge: combineMerge }),
					{ arrayMerge: combineMerge }
				);

				const storedOverrides = this.storage.get(themeName);

				this.themes[themeName] = {
					isFromStorage: Boolean(Object.keys(storedOverrides || {})?.length),
					base,
					overrides: storedOverrides || {},
					merged,
				};
				if (storedOverrides) {
					this.regenerateTheme(themeName);
				}
			}
		}
	}

	public setThemeOverrides(obj: { themeName: string; path: string[]; rootEditingKey: string; value: string }): void {
		const { themeName, path, rootEditingKey, value } = obj;

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

		this.themes[themeName].overrides = deepmerge(this.themes[themeName].overrides, overrides, { arrayMerge: combineMerge });
		this.regenerateTheme(themeName);
	}
	public regenerateTheme(themeName: string): void {
		if (this.themes && this.themes[themeName]) {
			const merged: any = deepmerge(
				deepmerge(
					this.themes[themeName].base,
					deepmerge(this.library.locales.language[this.language], this.library.locales.currency[this.currency], { arrayMerge: combineMerge }),
					{ arrayMerge: combineMerge }
				),
				this.themes[themeName].overrides,
				{ arrayMerge: combineMerge }
			);

			this.themes = {
				...this.themes,
				[themeName]: {
					...this.themes[themeName],
					merged,
				},
			};
		}
	}

	public regenerateThemes(): void {
		Object.keys(this.themes || {}).forEach((themeName) => {
			this.regenerateTheme(themeName);
		});
	}

	public changeCurrency(currency: string): void {
		this.currency = currency;
		this.regenerateThemes();
	}

	public changeLanguage(language: string): void {
		this.language = language;
		this.regenerateThemes();
	}

	public changeTemplate(type: TemplateTypes, target: string, template: string): void {
		this.templates = {
			...this.templates,
			[type]: {
				...this.templates[type],
				[target]: template,
			},
		};
	}

	public save(theme: string) {
		const overrides = this.themes[theme].overrides;
		this.storage.set(theme, overrides);
	}

	public removeFromStorage(theme: string) {
		this.storage.set(theme, {});
	}
}

const deepFreeze = (obj: any) => {
	Object.keys(obj).forEach((prop) => {
		if (typeof obj[prop] === 'object') {
			deepFreeze(obj[prop]);
		}
	});
	return Object.freeze(obj);
};

const combineMerge = (target: any, source: any, options: any) => {
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
