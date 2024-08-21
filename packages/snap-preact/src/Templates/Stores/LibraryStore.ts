import { FunctionalComponent, RenderableProps } from 'preact';

import type { Theme } from '../../../components/src';
import type { TemplateComponentTypes, TemplateCustomComponentTypes } from './TemplateStore';
import type { TemplateStoreComponentConfig } from './TemplateStore';

type LibraryImports = {
	theme: {
		[themeName: string]: (args?: any) => Theme | Promise<Theme>;
	};
	component: {
		[key in TemplateComponentTypes]: {
			[componentName: string]: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>>;
		};
	};
	language: {
		[languageName: string]: () => Promise<Partial<Theme>>;
	};
	currency: {
		[currencyName: string]: () => Promise<Partial<Theme>>;
	};
};
const ALLOWED_CUSTOM_COMPONENT_TYPES: TemplateCustomComponentTypes[] = ['result', 'badge'];

export class LibraryStore {
	themes: {
		[themeName: string]: Theme;
	} = {};

	components: {
		[key in TemplateComponentTypes]: {
			[componentName: string]: FunctionalComponent<RenderableProps<any>>;
		};
	} = {
		search: {},
		autocomplete: {},
		recommendation: {},
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
				Recommendation: async () => {
					return (
						this.components.recommendation.Recommendation ||
						(this.components.recommendation.Recommendation = (await import('./library/components/Recommendation')).Recommendation)
					);
				},
				RecommendationBundle: async () => {
					return (
						this.components.recommendation.RecommendationBundle ||
						(this.components.recommendation.RecommendationBundle = (await import('./library/components/RecommendationBundle')).RecommendationBundle)
					);
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

	constructor(components?: TemplateStoreComponentConfig) {
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

	async addComponentImport(
		type: TemplateCustomComponentTypes,
		name: string,
		componentFn: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>> | FunctionalComponent<RenderableProps<any>>
	) {
		// only allow certain types: 'results' and 'badges' - otherwise section components could be added (eg: 'search')
		if (ALLOWED_CUSTOM_COMPONENT_TYPES.includes(type) && this.components[type]) {
			this.import.component[type][name] = async () => {
				return (
					this.components[type as keyof typeof this.components][name] ||
					(this.components[type as keyof typeof this.components][name] = await componentFn())
				);
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
					const componentGroup = importList[importName as keyof typeof importList] as { [componentName: string]: () => Promise<any> };
					Object.keys(componentGroup).forEach((componentName) => {
						loadPromises.push(componentGroup[componentName]());
					});
				} else {
					const importer = importList[importName as keyof typeof importList] as () => Promise<any>;
					loadPromises.push(importer());
				}
			});
		});

		return Promise.all(loadPromises);
	}
}
