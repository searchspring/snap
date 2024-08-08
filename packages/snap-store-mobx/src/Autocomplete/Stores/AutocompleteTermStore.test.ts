import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { AutocompleteTermStore } from './AutocompleteTermStore';
import { AutocompleteStateStore } from './AutocompleteStateStore';

const mockResetTrending = jest.fn();

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

let config = {
	id: 'autocomplete',
	selector: 'input.searchspring-ac',
	settings: {
		integratedSpellCorrection: true,
	},
};

const mockData = new MockData();

const rootState = new AutocompleteStateStore({ services });

describe('Term Store', () => {
	it('has a symbol species of Array', () => {
		expect(AutocompleteTermStore[Symbol.species]).toBe(Array);
	});

	it('is empty when it is passed undefined', () => {
		// @ts-ignore
		const termStore = new AutocompleteTermStore();

		expect(termStore).toEqual([]);
	});

	it('is empty when it is passed no data', () => {
		const termStore = new AutocompleteTermStore({
			config,
			services,
			functions: {
				resetTerms: mockResetTrending,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				autocomplete: {},
			},
		});

		expect(termStore).toEqual([]);
	});

	it('contains the correct terms', () => {
		const searchData = mockData.autocompleteMeta();
		const termStore = new AutocompleteTermStore({
			config,
			services,
			functions: {
				resetTerms: mockResetTrending,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				autocomplete: searchData,
			},
		});

		const expected = [searchData.autocomplete?.suggested?.text, ...searchData.autocomplete?.alternatives?.map((alt) => alt.text)!];

		expect(termStore.map((term) => term.value)).toStrictEqual(expected);
	});

	it('builds terms with the correct properties', () => {
		const fn = jest.spyOn(services.urlManager, 'set');
		const searchData = mockData.autocompleteMeta();
		const termStore = new AutocompleteTermStore({
			config,
			services,
			functions: {
				resetTerms: mockResetTrending,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				autocomplete: searchData,
			},
		});

		termStore.forEach((term) => {
			expect(term).toHaveProperty('value');
			expect(term).toHaveProperty('active');
			expect(term).toHaveProperty('url');
			expect(term.url).toHaveProperty('href');
			expect(term).toHaveProperty('preview');
		});

		expect(fn).toHaveBeenCalledTimes(termStore.length);
	});

	it('has terms with undefined url properties when no services is present', () => {
		const searchData = mockData.autocompleteMeta();
		const termStore = new AutocompleteTermStore({
			config,
			// @ts-ignore - services is not present
			services: undefined,
			functions: {
				resetTerms: mockResetTrending,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				autocomplete: searchData,
			},
		});

		termStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has terms with undefined url properties when no urlManager is present', () => {
		const services = {};

		const searchData = mockData.autocompleteMeta();
		const termStore = new AutocompleteTermStore({
			config,
			// @ts-ignore - urlManager is not present
			services,
			functions: {
				resetTerms: mockResetTrending,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				autocomplete: searchData,
			},
		});

		termStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('sets the correct active term', () => {
		const searchData = mockData.autocompleteMeta();
		const termStore = new AutocompleteTermStore({
			config,
			services,
			functions: {
				resetTerms: mockResetTrending,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				autocomplete: searchData,
			},
		});

		expect(termStore.filter((term) => term.active).map((term) => term.value)).toStrictEqual([searchData.autocomplete?.query]);
	});

	it('has a preview function on terms', () => {
		const searchData = mockData.autocompleteMeta();
		const termStore = new AutocompleteTermStore({
			config,
			services,
			functions: {
				resetTerms: mockResetTrending,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				autocomplete: searchData,
			},
		});

		expect(rootState.locks.terms.locked).toBe(false);

		termStore.forEach((term, index) => {
			expect(term.active).toBe(index === 0 ? true : false);
		});
		termStore[1].preview();

		expect(mockResetTrending).toHaveBeenCalled();

		termStore.forEach((term, index) => {
			expect(term.active).toBe(index === 1 ? true : false);
		});

		expect(rootState.locks.terms.locked).toBe(true);
	});
});
