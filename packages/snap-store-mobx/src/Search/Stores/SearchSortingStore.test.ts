import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { SearchSortingStore } from './SearchSortingStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('Sorting Store', () => {
	beforeEach(() => {
		expect.hasAssertions();
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		//  @ts-ignore
		const sort = new SearchSortingStore(undefined, undefined, undefined, undefined);
		expect(sort.options.length).toBe(0);
	});

	it('returns an empty array when nothing is passed as sorting', () => {
		const searchData = mockData.searchMeta();
		//  @ts-ignore
		const sort = new SearchSortingStore(services, undefined, undefined, searchData.meta);
		expect(sort.options.length).toBeGreaterThan(0);
	});

	it('uses the search response sorting data to set the "current" sort', () => {
		const searchData = mockData.searchMeta('sorting');
		//  @ts-ignore
		const sort = new SearchSortingStore(services, searchData.sorting!, undefined, searchData.meta);

		expect(sort.current).toBeDefined();
		expect(sort.current?.field).toBe(searchData.sorting && searchData.sorting[0].field);
		expect(sort.current?.direction).toBe(searchData.sorting && searchData.sorting[0].direction);
	});

	describe('without a search query', () => {
		it('uses the meta data to construct its options', () => {
			const searchData = mockData.searchMeta();
			//  @ts-ignore
			const sort = new SearchSortingStore(services, undefined, undefined, searchData.meta);
			const sortingData = searchData.meta.sortOptions?.filter((option) => option.type == 'field');

			expect(sort.options).toHaveLength(sortingData?.length!);

			sort.options.forEach((sortOption, index) => {
				expect(sortOption.active).toBeDefined();
				expect(sortOption.type).toBe(sortingData && sortingData[index].type);
				expect(sortOption.field).toBe(sortingData && sortingData[index].field);
				expect(sortOption.direction).toBe(sortingData && sortingData[index].direction);
				expect(sortOption.label).toBe(sortingData && sortingData[index].label);
			});

			expect(sort.current).toBeDefined();
		});

		it('uses the first sort option to set "current" when the search response sorting data is empty', () => {
			const searchData = mockData.searchMeta();
			// @ts-ignore
			const sort = new SearchSortingStore(services, undefined, undefined, searchData.meta);
			const sortingData = searchData.meta.sortOptions?.filter((option) => option.type == 'field');

			expect(sort.options).toHaveLength(sortingData?.length!);

			expect(sort.current).toBeDefined();
			expect(sort.current?.field).toBe(sortingData && sortingData[0].field);
			expect(sort.current?.direction).toBe(sortingData && sortingData[0].direction);
		});

		it('uses the first sorting option to set "current" when response sorting data is not empty', () => {
			const searchData = mockData.searchMeta('sorting');
			// @ts-ignore
			const sort = new SearchSortingStore(services, searchData.sorting!, undefined, searchData.meta);
			const sortingData = searchData.meta.sortOptions?.filter((option) => option.type == 'field');

			expect(sort.options).toHaveLength(sortingData?.length!);

			expect(sort.current).toBeDefined();
			expect(sort.current?.field).toBe(searchData.sorting && searchData.sorting[0].field);
			expect(sort.current?.direction).toBe(searchData.sorting && searchData.sorting[0].direction);
		});
	});

	describe('with a search query', () => {
		it('uses the meta data to construct its options', () => {
			const searchData = mockData.searchMeta('dress');
			//  @ts-ignore
			const sort = new SearchSortingStore(services, undefined, searchData.search, searchData.meta);
			const sortingData = searchData.meta.sortOptions;
			const relevanceSorts = searchData.meta.sortOptions?.filter((option) => option.type == 'relevance');

			expect(sort.options).toHaveLength(sortingData?.length!);

			sort.options.forEach((sortOption, index) => {
				expect(sortOption.active).toBeDefined();
				expect(sortOption.type).toBe(sortingData && sortingData[index].type);
				expect(sortOption.field).toBe(sortingData && sortingData[index].field);
				expect(sortOption.direction).toBe(sortingData && sortingData[index].direction);
				expect(sortOption.label).toBe(sortingData && sortingData[index].label);
			});

			expect(sort.current).toBeDefined();
			expect(sort.current?.field).toBe(relevanceSorts && relevanceSorts[0].field);
			expect(sort.current?.direction).toBe(relevanceSorts && relevanceSorts[0].direction);
		});

		it('uses the first sorting option to set "current" when response sorting data is not empty', () => {
			const searchData = mockData.searchMeta('dressSorting');
			const sort = new SearchSortingStore(services, searchData.sorting!, searchData.search!, searchData.meta);
			const sortingData = searchData.meta.sortOptions;

			expect(sort.options).toHaveLength(sortingData?.length!);

			expect(sort.current).toBeDefined();
			expect(sort.current?.field).toBe(searchData.sorting && searchData.sorting[0].field);
			expect(sort.current?.direction).toBe(searchData.sorting && searchData.sorting[0].direction);
		});
	});
});
