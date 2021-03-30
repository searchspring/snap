import { TermStore } from './TermStore';
import { StateStore } from './StateStore';

import { SearchData } from '../../__mocks__/SearchData';
import { mockAutocompleteController } from '../../__mocks__/mockControllers';
import { mockUrlManager } from '../../__mocks__/mockUrlManager';

const rootState = new StateStore();

describe('Term Store', () => {
	it('has a symbol species of Array', () => {
		expect(TermStore[Symbol.species]).toBe(Array);
	});

	it('is empty when it is passed undefined', () => {
		const termStore = new TermStore(mockAutocompleteController, undefined, undefined, rootState);

		expect(termStore).toEqual([]);
	});

	it('is empty when it is passed no data', () => {
		const termStore = new TermStore(mockAutocompleteController, {}, {}, rootState);

		expect(termStore).toEqual([]);
	});

	it('contains the correct terms', () => {
		const searchData = new SearchData({ search: 'autocomplete' });
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(mockAutocompleteController, autocomplete, searchData.pagination, rootState);

		const expected = [autocomplete.suggested.text, ...autocomplete.alternatives.map((alt) => alt.text)];

		expect(termStore.map((term) => term.value)).toStrictEqual(expected);
	});

	it('builds terms with the correct properties', () => {
		const mockAutocompleteController = {
			config: {},
			urlManager: mockUrlManager,
		};

		mockAutocompleteController.urlManager.set = jest.fn(() => mockUrlManager);
		const searchData = new SearchData({ search: 'autocomplete' });
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(mockAutocompleteController, autocomplete, searchData.pagination, rootState);

		termStore.forEach((term) => {
			expect(term).toHaveProperty('value');
			expect(term).toHaveProperty('active');
			expect(term).toHaveProperty('url');
			expect(term).toHaveProperty('preview');
		});

		expect(mockAutocompleteController.urlManager.set).toHaveBeenCalledTimes(termStore.length);
	});

	it('has terms with undefined url properties when no controller is present', () => {
		const searchData = new SearchData({ search: 'autocomplete' });
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(undefined, autocomplete, searchData.pagination, rootState);

		termStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has terms with undefined url properties when no urlManager is present', () => {
		const mockAutocompleteController = {
			config: {},
		};

		const searchData = new SearchData({ search: 'autocomplete' });
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(mockAutocompleteController, autocomplete, searchData.pagination, rootState);

		termStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('sets the correct active term', () => {
		const searchData = new SearchData({ search: 'autocomplete' });
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(mockAutocompleteController, autocomplete, searchData.pagination, rootState);

		expect(termStore.filter((term) => term.active).map((term) => term.value)).toStrictEqual([autocomplete.query]);
	});

	it('has a preview function on terms', () => {
		const searchData = new SearchData({ search: 'autocomplete' });
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(mockAutocompleteController, autocomplete, searchData.pagination, rootState);

		expect(rootState.locks.terms.locked).toBe(false);

		termStore.forEach((term, index) => {
			expect(term.active).toBe(index === 0 ? true : false);
		});

		termStore[2].preview();

		termStore.forEach((term, index) => {
			expect(term.active).toBe(index === 2 ? true : false);
		});

		expect(rootState.locks.terms.locked).toBe(true);
	});
});
