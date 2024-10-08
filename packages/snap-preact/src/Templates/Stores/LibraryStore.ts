import { FunctionalComponent, RenderableProps } from 'preact';

import type { Theme, ThemeMinimal } from '../../../components/src';
import type { TemplateCustomComponentTypes, TemplateTypes } from './TemplateStore';
import type { TemplateStoreComponentConfig } from './TemplateStore';
import type { PluginFunction } from '@searchspring/snap-controller';
import { backgroundFilters as shopifyBackgroundFilters, updateResultsUrl as shopifyUpdateResultsUrl } from '@searchspring/snap-platforms/shopify';
import { backgroundFilters as bigcommerceBackgroundFilters } from '@searchspring/snap-platforms/bigcommerce';
import { backgroundFilters as magento2BackgroundFilters } from '@searchspring/snap-platforms/magento2';
import { genericBackgroundFilters } from './library/middleware/genericBackgroundFilters';
import { scrollToTop } from './library/middleware/scrollToTop';
import { storeLogger } from './library/middleware/storeLogger';

type LibraryComponentImport = {
	[componentName: string]: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
};

type LibraryComponentMap = {
	[componentName: string]: FunctionalComponent<RenderableProps<any>>;
};

export type LibraryImports = {
	theme: {
		bocachica: (args?: any) => Promise<Theme>;
	};
	plugins: {
		shopify: {
			backgroundFilters: PluginFunction;
			updateResultsUrl: PluginFunction;
		};
		bigcommerce: {
			backgroundFilters: PluginFunction;
		};
		magento2: {
			backgroundFilters: PluginFunction;
		};
		other: {
			genericBackgroundFilters: PluginFunction;
			scrollToTop: PluginFunction;
			storeLogger: PluginFunction;
		};
	};
	component: {
		search: {
			Search: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
			SearchHorizontal: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
		};
		autocomplete: {
			Autocomplete: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
		};
		recommendation: {
			bundle: {
				RecommendationBundle: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
			};
			default: {
				Recommendation: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
				RecommendationGrid: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
			};
			email: {
				RecommendationEmail: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
			};
		};
		badge: {
			[componentName: string]: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
		};
		result: {
			Result: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
			[componentName: string]: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
		};
	};
	language: {
		[languageName in LanguageCodes]: () => Promise<ThemeMinimal>;
	};
	currency: {
		[currencyName in CurrencyCodes]: () => Promise<ThemeMinimal>;
	};
};
const ALLOWED_CUSTOM_COMPONENT_TYPES: TemplateCustomComponentTypes[] = ['result', 'badge'];

type LibraryStoreConfig = {
	components?: TemplateStoreComponentConfig;
};

export type CurrencyCodes = 'usd' | 'eur' | 'aud';
export type LanguageCodes = 'en';

export class LibraryStore {
	themes: {
		[themeName: string]: Theme;
	} = {};

	components: {
		search: LibraryComponentMap;
		autocomplete: LibraryComponentMap;
		recommendation: {
			bundle: LibraryComponentMap;
			default: LibraryComponentMap;
			email: LibraryComponentMap;
		};
		badge: LibraryComponentMap;
		result: LibraryComponentMap;
	} = {
		search: {},
		autocomplete: {},
		recommendation: {
			bundle: {},
			default: {},
			email: {},
		},
		badge: {},
		result: {},
	};

	locales: {
		currencies: {
			[currencyName in CurrencyCodes]?: ThemeMinimal;
		};
		languages: {
			[languageName in LanguageCodes]?: ThemeMinimal;
		};
	} = {
		currencies: {},
		languages: {},
	};

	import: LibraryImports = {
		theme: {
			bocachica: async () => {
				return this.themes.bocachica || (this.themes.bocachica = (await import('./library/themes/bocachica')).bocachica);
			},
		},
		plugins: {
			shopify: {
				backgroundFilters: shopifyBackgroundFilters,
				updateResultsUrl: shopifyUpdateResultsUrl,
			},
			bigcommerce: {
				backgroundFilters: bigcommerceBackgroundFilters,
			},
			magento2: {
				backgroundFilters: magento2BackgroundFilters,
			},
			other: {
				genericBackgroundFilters: genericBackgroundFilters,
				scrollToTop: scrollToTop,
				storeLogger: storeLogger,
			},
		},
		component: {
			autocomplete: {
				Autocomplete: async () => {
					return (
						this.components.autocomplete.Autocomplete ||
						(this.components.autocomplete.Autocomplete = (await import('./library/components/Autocomplete')).Autocomplete)
					);
				},
			},
			search: {
				Search: async () => {
					return this.components.search.Search || (this.components.search.Search = (await import('./library/components/Search')).Search);
				},
				SearchHorizontal: async () => {
					return (
						this.components.search.SearchHorizontal ||
						(this.components.search.SearchHorizontal = (await import('./library/components/SearchHorizontal')).SearchHorizontal)
					);
				},
			},
			recommendation: {
				bundle: {
					RecommendationBundle: async () => {
						return (
							this.components.recommendation.bundle.RecommendationBundle ||
							(this.components.recommendation.bundle.RecommendationBundle = (
								await import('./library/components/RecommendationBundle')
							).RecommendationBundle)
						);
					},
				},
				default: {
					Recommendation: async () => {
						return (
							this.components.recommendation.default.Recommendation ||
							(this.components.recommendation.default.Recommendation = (await import('./library/components/Recommendation')).Recommendation)
						);
					},
					RecommendationGrid: async () => {
						return (
							this.components.recommendation.default.RecommendationGrid ||
							(this.components.recommendation.default.RecommendationGrid = (
								await import('./library/components/RecommendationGrid')
							).RecommendationGrid)
						);
					},
				},
				email: {
					RecommendationEmail: async () => {
						return (
							this.components.recommendation.email.RecommendationEmail ||
							(this.components.recommendation.email.RecommendationEmail = (
								await import('./library/components/RecommendationEmail')
							).RecommendationEmail)
						);
					},
				},
			},
			badge: {},
			result: {
				Result: async () => {
					return this.components.result.Result || (this.components.result.Result = (await import('./library/components/Result')).Result);
				},
			},
		},
		language: {
			en: async () => {
				return this.locales.languages.en || (this.locales.languages.en = (await import('./library/languages/en')).en);
			},
		},
		currency: {
			usd: async () => {
				return this.locales.currencies.usd || (this.locales.currencies.usd = (await import('./library/currencies/usd')).usd);
			},
			eur: async () => {
				return this.locales.currencies.eur || (this.locales.currencies.eur = (await import('./library/currencies/eur')).eur);
			},
			aud: async () => {
				return this.locales.currencies.aud || (this.locales.currencies.aud = (await import('./library/currencies/aud')).aud);
			},
		},
	};

	constructor(params?: LibraryStoreConfig) {
		const { components } = params || {};
		// allow for configuration to supply custom component imports
		if (components) {
			Object.keys(components).forEach((type) => {
				const componentsOfType = components[type as keyof typeof components];
				Object.keys(componentsOfType).forEach((component) => {
					this.addComponentImport(type as TemplateCustomComponentTypes, component, componentsOfType[component as keyof typeof components]);
				});
			});
		}
	}

	getComponent(type: TemplateTypes, name: string): FunctionalComponent<RenderableProps<any>> | undefined {
		const paths = type.split('/');
		paths.push(name);
		let importPath: any = this.components;
		for (let i = 0; i < paths.length; i++) {
			if (!importPath[paths[i]]) {
				return undefined;
			}
			importPath = importPath[paths[i]];
		}
		return importPath;
	}

	async addComponentImport(
		type: TemplateCustomComponentTypes,
		name: string,
		componentFn: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>> | FunctionalComponent<RenderableProps<any>>
	) {
		// only allow certain types: 'results' and 'badges' - otherwise section components could be added (eg: 'search')
		if (ALLOWED_CUSTOM_COMPONENT_TYPES.includes(type) && this.components[type]) {
			this.import.component[type][name] = async () => {
				return this.components[type][name] || (this.components[type][name] = await componentFn());
			};
		}
	}

	async preLoad() {
		// load everything
		const loadPromises: Promise<any>[] = [];
		Object.keys(this.import).forEach((importGroup) => {
			const importList = this.import[importGroup as keyof typeof this.import];

			Object.keys(importList).forEach((importName) => {
				if (importGroup === 'component') {
					if (importName === 'recommendation') {
						const componentSubType = (importList as LibraryStore['import']['component']).recommendation;
						Object.keys(componentSubType).forEach((type) => {
							const componentGroup = componentSubType[type as keyof typeof componentSubType] as { [componentName: string]: () => Promise<any> };
							Object.keys(componentGroup).forEach((componentName) => {
								loadPromises.push(componentGroup[componentName]());
							});
						});
					} else {
						const componentGroup = importList[importName as keyof typeof importList] as LibraryComponentImport;
						Object.keys(componentGroup).forEach((componentName) => {
							loadPromises.push(componentGroup[componentName]());
						});
					}
				} else if (importGroup === 'language' || importGroup === 'currency') {
					const importer = importList[importName as keyof typeof importList] as () => Promise<ThemeMinimal>;
					loadPromises.push(importer());
				} else if (importGroup === 'theme') {
					const importer = importList[importName as keyof typeof importList] as () => Promise<Theme>;
					loadPromises.push(importer());
				}
			});
		});

		return Promise.all(loadPromises);
	}
}
