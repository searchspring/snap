import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { AutocompleteHistoryStore } from './AutocompleteHistoryStore';
import { AutocompleteStateStore } from '../../Autocomplete/Stores/AutocompleteStateStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};
const rootState = new AutocompleteStateStore({ services });
const mockResetTerms = jest.fn();

const queries = ['shirts', 'pants', 'shorts', 'shoes', 'socks'];

describe('Autocomplete History Store', () => {
	it('has a symbol species of Array', () => {
		expect(AutocompleteHistoryStore[Symbol.species]).toBe(Array);
	});

	it('is empty when it is passed undefined queries', () => {
		const historyStore = new AutocompleteHistoryStore({
			services,
			functions: {
				resetTerms: mockResetTerms,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				// @ts-ignore - queries is undefined
				queries: undefined,
			},
		});

		expect(historyStore).toEqual([]);
	});

	it('is empty when it is passed an empty array of queries', () => {
		const historyStore = new AutocompleteHistoryStore({
			services,
			functions: {
				resetTerms: mockResetTerms,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				queries: [],
			},
		});

		expect(historyStore).toEqual([]);
	});

	it('contains the correct terms', () => {
		const historyStore = new AutocompleteHistoryStore({
			services,
			functions: {
				resetTerms: mockResetTerms,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				queries,
			},
		});
		expect(historyStore).toHaveLength(queries.length);

		historyStore.forEach((term, index) => {
			expect(term).toHaveProperty('url');
			expect(term.url).toBeInstanceOf(UrlManager);
			expect(term).toHaveProperty('preview');
			expect(term.preview).toBeDefined();
			expect(term).toHaveProperty('active');
			expect(term.active).toEqual(false);
			expect(term).toHaveProperty('value');
			expect(term.value).toEqual(queries[index]);
		});
	});

	it('has terms with undefined url properties when no services are present', () => {
		const historyStore = new AutocompleteHistoryStore({
			// @ts-ignore - services is missing urlManager
			services: undefined,
			functions: {
				resetTerms: mockResetTerms,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				queries,
			},
		});

		historyStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has terms with undefined url properties when no urlManager is present', () => {
		const services = {};

		const historyStore = new AutocompleteHistoryStore({
			// @ts-ignore - services is missing urlManager
			services: services,
			functions: {
				resetTerms: mockResetTerms,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				queries,
			},
		});

		historyStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has a preview function on terms', () => {
		const historyStore = new AutocompleteHistoryStore({
			services: services,
			functions: {
				resetTerms: mockResetTerms,
			},
			state: {
				autocomplete: rootState,
			},
			data: {
				queries,
			},
		});

		expect(rootState.locks.terms.locked).toBe(false);

		historyStore.forEach((term) => {
			expect(term.active).toBe(false);
		});

		historyStore[0].preview();

		expect(mockResetTerms).toHaveBeenCalled();

		historyStore.forEach((term, index) => {
			expect(term.active).toBe(index === 0 ? true : false);
		});

		expect(rootState.locks.terms.locked).toBe(true);
	});
});
