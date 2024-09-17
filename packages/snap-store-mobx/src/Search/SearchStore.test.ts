import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { SearchStore } from './SearchStore';
import { SearchResponseModel, MetaResponseModel } from '@searchspring/snapi-types';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const searchConfig = {
	id: 'search',
};

const mockData = new MockData();

describe('Search Store', () => {
	let searchData: { search: SearchResponseModel; meta: MetaResponseModel };

	beforeEach(() => {
		searchData = { search: mockData.search(), meta: mockData.meta() };
	});

	it('returns correct initial state', () => {
		const searchStore = new SearchStore(searchConfig, services);

		expect(searchStore.loading).toBe(false);

		expect(searchStore.meta).toBeDefined();
		expect(searchStore.meta?.data).toStrictEqual({});

		expect(searchStore.merchandising).toBeDefined();
		expect(searchStore.merchandising).toEqual({ redirect: '', content: {}, campaigns: [] });

		expect(searchStore.search).toBeDefined();
		expect(searchStore.search).toEqual({ query: undefined });

		expect(searchStore.facets).toBeDefined();
		expect(searchStore.facets).toHaveLength(0);

		expect(searchStore.filters).toBeDefined();
		expect(searchStore.filters).toHaveLength(0);

		expect(searchStore.results).toBeDefined();
		expect(searchStore.results).toHaveLength(0);

		expect(searchStore.pagination).toBeDefined();
		expect(searchStore.pagination?.totalResults).toBeUndefined();

		expect(searchStore.sorting).toBeDefined();
		expect(searchStore.sorting?.options).toHaveLength(0);
	});

	it('update function updates all of the stores', () => {
		const searchStore = new SearchStore(searchConfig, services);
		searchStore.update(searchData);

		expect(searchStore.meta).toBeDefined();
		expect(searchStore.meta?.data).toStrictEqual(searchData.meta);

		expect(searchStore.search).toBeDefined();
		expect(searchStore.search?.query).toStrictEqual(searchData.search.search?.query);

		expect(searchStore.merchandising).toBeDefined();
		expect(searchStore.merchandising).toEqual(searchData.search.merchandising);

		expect(searchStore.facets).toHaveLength(searchData.search.facets?.length!);

		expect(searchStore.filters).toHaveLength(0);

		expect(searchStore.results).toHaveLength(searchData.search.results?.length!);

		expect(searchStore.pagination?.totalResults).toBe(searchData.search.pagination?.totalResults);

		expect(searchStore.sorting?.options).toHaveLength(searchData.meta.sortOptions?.filter((option) => option.type == 'field').length!);
	});
});
