import { SearchStore } from './SearchStore';

import { mockSearchController } from '../__mocks__/mockControllers';
import { SearchData } from '../__mocks__/SearchData';

describe('Search Store', () => {
	let searchData;
	beforeEach(() => {
		searchData = new SearchData();
	});

	it('returns correct initial state', () => {
		const searchStore = new SearchStore();
		searchStore.link(mockSearchController);

		expect(searchStore.loading).toBe(true);

		expect(searchStore.meta).toBeDefined();
		expect(searchStore.meta).toStrictEqual({});

		expect(searchStore.merchandising).toBeDefined();
		expect(searchStore.merchandising).toEqual({ redirect: '', content: {} });

		expect(searchStore.search).toBeDefined();
		expect(searchStore.search).toEqual({ query: undefined });

		expect(searchStore.facets).toBeDefined();
		expect(searchStore.facets).toHaveLength(0);

		expect(searchStore.filters).toBeDefined();
		expect(searchStore.filters).toHaveLength(0);

		expect(searchStore.results).toBeDefined();
		expect(searchStore.results).toHaveLength(0);

		expect(searchStore.pagination).toBeDefined();
		expect(searchStore.pagination.totalResults).toBeUndefined();

		expect(searchStore.sorting).toBeDefined();
		expect(searchStore.sorting.options).toHaveLength(0);
	});

	it('update function updates all of the stores', () => {
		const searchStore = new SearchStore();
		searchStore.link(mockSearchController);
		searchStore.update(searchData);

		expect(searchStore.meta).toBeDefined();
		expect(searchStore.meta).toStrictEqual(searchData.meta);

		expect(searchStore.search).toBeDefined();
		expect(searchStore.search.query).toStrictEqual(searchData.search.query);

		expect(searchStore.merchandising).toBeDefined();
		expect(searchStore.merchandising).toEqual(searchData.merchandising);

		expect(searchStore.facets).toHaveLength(searchData.facets.length);

		expect(searchStore.filters).toHaveLength(0);

		expect(searchStore.results).toHaveLength(searchData.results.length);

		expect(searchStore.pagination.totalResults).toBe(searchData.pagination.totalResults);

		expect(searchStore.sorting.options).toHaveLength(searchData.meta.sortOptions.length);
	});
});
