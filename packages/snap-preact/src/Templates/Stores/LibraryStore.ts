import type { Theme } from '../../../components/src';
import type { FunctionalComponent } from 'preact';
import type { TemplateTypes } from './TemplateStore';

export class LibraryStore {
	themes: {
		[themeName: string]: Theme;
	} = {};

	components: {
		[key in TemplateTypes]: {
			[componentName: string]: FunctionalComponent<any>;
		};
	} = {
		search: {},
		autocomplete: {},
		recommendation: {},
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

	import = {
		theme: {
			pike: async () => {
				return this.themes.pike || (this.themes.pike = (await import('./library/themes/pike')).pike);
			},
			bocachica: async () => {
				return this.themes.bocachica || (this.themes.bocachica = (await import('./library/themes/bocachica')).bocachica);
			},
		},
		component: {
			Autocomplete: async () => {
				return (
					this.components.autocomplete.Autocomplete ||
					(this.components.autocomplete.Autocomplete = (await import('./library/components/Autocomplete')).Autocomplete)
				);
			},
			Search: async () => {
				return this.components.search.Search || (this.components.search.Search = (await import('./library/components/Search')).Search);
			},
			SearchTest: async () => {
				return (
					this.components.search.SearchTest || (this.components.search.SearchTest = (await import('./library/components/SearchTest')).SearchTest)
				);
			},
			Recommendation: async () => {
				return (
					this.components.recommendation.Recommendation ||
					(this.components.recommendation.Recommendation = (await import('./library/components/Recommendation')).Recommendation)
				);
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
		},
	};

	constructor() {
		// anything?
	}

	async preLoad() {
		// load everything
		const loadPromises: Promise<any>[] = [];
		Object.keys(this.import).forEach((importGroup) => {
			const importList = this.import[importGroup as keyof typeof this.import];
			Object.keys(importList).forEach((importName) => {
				const importer = importList[importName as keyof typeof importList] as () => Promise<any>;
				loadPromises.push(importer());
			});
		});

		return Promise.all(loadPromises);
	}
}
