import { ResultComponent } from '../../../components/src/types';
import { LibraryStore } from './LibraryStore';

describe('LibraryStore', () => {
	it('has expected defaults', () => {
		const store = new LibraryStore();
		expect(store).toBeDefined();
		expect(store.themes).toStrictEqual({});
		expect(store.components).toStrictEqual({
			search: {},
			autocomplete: {},
			recommendation: {
				bundle: {},
				default: {},
				email: {},
			},
			badge: {},
			result: {},
		});
		expect(store.locales).toStrictEqual({
			currencies: {},
			languages: {},
		});
	});

	it('can define custom components and register them when imported', async () => {
		const components = {
			result: {
				Result: async () => ({} as ResultComponent),
			},
			badge: {
				Badge: async () => ({} as ResultComponent),
			},
			dne: {
				Dne: async () => ({} as ResultComponent),
			},
		};
		const store = new LibraryStore({ components });
		expect(store).toBeDefined();

		expect(store.import.component.result['Result']).toBeDefined();
		expect(store.import.component.badge['Badge']).toBeDefined();

		// @ts-ignore - should not be able to register unknown components
		expect(store.import.component.dne?.['Dne']).toBeUndefined();

		expect(store.components.result['Result']).toBeUndefined();
		await store.import.component.result['Result']();
		expect(store.components.result['Result']).toBeDefined();
		expect(store.components.result['Result']).toStrictEqual({});

		expect(store.components.badge['Badge']).toBeUndefined();
		await store.import.component.badge['Badge']();
		expect(store.components.badge['Badge']).toBeDefined();
		expect(store.components.badge['Badge']).toStrictEqual({});
	});

	it('can import and register library components', async () => {
		const store = new LibraryStore();

		const themes = Object.keys(store.import.theme);
		for (let index = 0; index < themes.length; index++) {
			const theme = themes[index];
			expect(store.import.theme[theme]).toBeDefined();
			expect(store.themes[theme]).not.toBeDefined();
			await store.import.theme[theme]();
			expect(store.themes[theme]).toBeDefined();
		}

		const autocompleteComponents = Object.keys(store.import.component.autocomplete);
		for (let index = 0; index < autocompleteComponents.length; index++) {
			const componentName = autocompleteComponents[index];
			expect(store.import.component.autocomplete[componentName]).toBeDefined();
			expect(store.components.autocomplete[componentName]).not.toBeDefined();
			await store.import.component.autocomplete[componentName]();
			expect(store.components.autocomplete[componentName]).toBeDefined();
		}

		const searchComponents = Object.keys(store.import.component.search);
		for (let index = 0; index < searchComponents.length; index++) {
			const componentName = searchComponents[index];
			expect(store.import.component.search[componentName]).toBeDefined();
			expect(store.components.search[componentName]).not.toBeDefined();
			await store.import.component.search[componentName]();
			expect(store.components.search[componentName]).toBeDefined();
		}

		// TODO: swiper ES modules not supported in jest
		// const recommendationComponents = Object.keys(store.import.component.recommendation);
		// for (let index = 0; index < recommendationComponents.length; index++) {
		// 	const componentName = recommendationComponents[index];
		// 	expect(store.import.component.recommendation[componentName]).toBeDefined();
		// 	await store.import.component.recommendation[componentName]();
		// 	expect(store.components.recommendation[componentName]).toBeDefined();
		// }

		const badgeComponents = Object.keys(store.import.component.badge);
		for (let index = 0; index < badgeComponents.length; index++) {
			const componentName = badgeComponents[index];
			expect(store.import.component.badge[componentName]).toBeDefined();
			expect(store.components.badge[componentName]).not.toBeDefined();
			await store.import.component.badge[componentName]();
			expect(store.components.badge[componentName]).toBeDefined();
		}

		const resultComponents = Object.keys(store.import.component.result);
		for (let index = 0; index < resultComponents.length; index++) {
			const componentName = resultComponents[index];
			expect(store.import.component.result[componentName]).toBeDefined();
			expect(store.components.result[componentName]).not.toBeDefined();
			await store.import.component.result[componentName]();
			expect(store.components.result[componentName]).toBeDefined();
		}

		const languages = Object.keys(store.import.language);
		for (let index = 0; index < languages.length; index++) {
			const language = languages[index];
			expect(store.import.language[language]).toBeDefined();
			expect(store.locales.languages[language]).not.toBeDefined();
			await store.import.language[language]();
			expect(store.locales.languages[language]).toBeDefined();
		}

		const currencies = Object.keys(store.import.currency);
		for (let index = 0; index < currencies.length; index++) {
			const currency = currencies[index];
			expect(store.import.currency[currency]).toBeDefined();
			expect(store.locales.currencies[currency]).not.toBeDefined();
			await store.import.currency[currency]();
			expect(store.locales.currencies[currency]).toBeDefined();
		}
	});

	// TODO: add preload tests when ES modules are supported in jest
	// it('can preload', async () => {
	// 	const store = new LibraryStore();
	// 	expect(store).toBeDefined();
	// 	await store.preLoad();
	// });
});
