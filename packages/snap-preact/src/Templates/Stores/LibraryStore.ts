import { FunctionalComponent, RenderableProps } from 'preact';

import type { Theme } from '../../../components/src';
import type { TemplateCustomComponentTypes, TemplateTypes } from './TemplateStore';
import type { TemplateStoreComponentConfig } from './TemplateStore';

type LibraryComponentImport = {
	[componentName: string]: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
};
type LibraryComponentMap = {
	[componentName: string]: FunctionalComponent<RenderableProps<any>>;
};
type LibraryImports = {
	theme: {
		[themeName: string]: (args?: any) => Theme | Promise<Theme>;
	};
	component: {
		search: LibraryComponentImport;
		autocomplete: LibraryComponentImport;
		recommendation: {
			bundle: LibraryComponentImport;
			default: LibraryComponentImport;
			email: LibraryComponentImport;
		};
		badge: LibraryComponentImport;
		result: LibraryComponentImport;
	};
	language: {
		[languageName: string]: () => Promise<Partial<Theme>>;
	};
	currency: {
		[currencyName: string]: () => Promise<Partial<Theme>>;
	};
};
const ALLOWED_CUSTOM_COMPONENT_TYPES: TemplateCustomComponentTypes[] = ['result', 'badge'];

type LibraryStoreConfig = {
	components?: TemplateStoreComponentConfig;
};

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
			[currencyName: string]: Partial<Theme>;
		};
		languages: {
			[languageName: string]: Partial<Theme>;
		};
	} = {
		currencies: {},
		languages: {},
	};

	import: LibraryImports = {
		theme: {
			pike: async () => {
				return this.themes.pike || (this.themes.pike = (await import('./library/themes/pike')).pike);
			},
			bocachica: async () => {
				return this.themes.bocachica || (this.themes.bocachica = (await import('./library/themes/bocachica')).bocachica);
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
				HorizontalSearch: async () => {
					return (
						this.components.search.HorizontalSearch ||
						(this.components.search.HorizontalSearch = (await import('./library/components/HorizontalSearch')).HorizontalSearch)
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
				},
				email: {},
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
			fr: async () => {
				return this.locales.languages.fr || (this.locales.languages.fr = (await import('./library/languages/fr')).fr);
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
						const componentSubType = importList.recommendation;
						Object.keys(componentSubType).forEach((type) => {
							const componentGroup = componentSubType[type as keyof typeof componentSubType] as { [componentName: string]: () => Promise<any> };
							Object.keys(componentGroup).forEach((componentName) => {
								loadPromises.push(componentGroup[componentName]());
							});
						});
					} else {
						const componentGroup = importList[importName as keyof typeof importList] as { [componentName: string]: () => Promise<any> };
						Object.keys(componentGroup).forEach((componentName) => {
							loadPromises.push(componentGroup[componentName]());
						});
					}
				} else {
					const importer = importList[importName as keyof typeof importList] as () => Promise<any>;
					loadPromises.push(importer());
				}
			});
		});

		return Promise.all(loadPromises);
	}
}
