import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { SortingStore } from './SortingStore';

import { SearchData } from '../../__mocks__/SearchData';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

describe('Sorting Store', () => {
	beforeEach(() => {
		expect.hasAssertions();
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		const sort = new SortingStore(undefined, undefined, undefined, undefined);
		expect(sort.options.length).toBe(0);
	});

	it('returns an empty array when nothing is passed as sorting', () => {
		const searchData = new SearchData();
		const sort = new SortingStore(services, undefined, undefined, searchData.meta);
		expect(sort.options.length).toBeGreaterThan(0);
	});

	it('uses the search response sorting data to set the "current" sort', () => {
		const searchData = new SearchData({ search: 'sorting' });
		const sort = new SortingStore(services, searchData.sorting, undefined, searchData.meta);

		expect(sort.current).toBeDefined();
		expect(sort.current.field).toBe(searchData.sorting[0].field);
		expect(sort.current.direction).toBe(searchData.sorting[0].direction);
	});

	describe('without a search query', () => {
		it('uses the meta data to construct its options', () => {
			const searchData = new SearchData();
			const sort = new SortingStore(services, undefined, undefined, searchData.meta);
			const sortingData = searchData.meta.sortOptions.filter((option) => option.type == 'field');

			expect(sort.options).toHaveLength(sortingData.length);

			sort.options.forEach((sortOption, index) => {
				expect(sortOption.active).toBeDefined();
				expect(sortOption.type).toBe(sortingData[index].type);
				expect(sortOption.field).toBe(sortingData[index].field);
				expect(sortOption.direction).toBe(sortingData[index].direction);
				expect(sortOption.label).toBe(sortingData[index].label);
			});

			expect(sort.current).toBeDefined();
		});

		it('uses the first sort option to set "current" when the search response sorting data is empty', () => {
			const searchData = new SearchData();
			const sort = new SortingStore(services, undefined, undefined, searchData.meta);
			const sortingData = searchData.meta.sortOptions.filter((option) => option.type == 'field');

			expect(sort.options).toHaveLength(sortingData.length);

			expect(sort.current).toBeDefined();
			expect(sort.current.field).toBe(sortingData[0].field);
			expect(sort.current.direction).toBe(sortingData[0].direction);
		});

		it('uses the first sorting option to set "current" when response sorting data is not empty', () => {
			const searchData = new SearchData({ search: 'sorting' });
			const sort = new SortingStore(services, searchData.sorting, undefined, searchData.meta);
			const sortingData = searchData.meta.sortOptions.filter((option) => option.type == 'field');

			expect(sort.options).toHaveLength(sortingData.length);

			expect(sort.current).toBeDefined();
			expect(sort.current.field).toBe(searchData.sorting[0].field);
			expect(sort.current.direction).toBe(searchData.sorting[0].direction);
		});
	});

	describe('with a search query', () => {
		it('uses the meta data to construct its options', () => {
			const searchData = new SearchData({ search: 'dress' });
			const sort = new SortingStore(services, undefined, searchData.search, searchData.meta);
			const sortingData = searchData.meta.sortOptions;
			const relevanceSorts = searchData.meta.sortOptions.filter((option) => option.type == 'relevance');

			expect(sort.options).toHaveLength(sortingData.length);

			sort.options.forEach((sortOption, index) => {
				expect(sortOption.active).toBeDefined();
				expect(sortOption.type).toBe(sortingData[index].type);
				expect(sortOption.field).toBe(sortingData[index].field);
				expect(sortOption.direction).toBe(sortingData[index].direction);
				expect(sortOption.label).toBe(sortingData[index].label);
			});

			expect(sort.current).toBeDefined();
			expect(sort.current.field).toBe(relevanceSorts[0].field);
			expect(sort.current.direction).toBe(relevanceSorts[0].direction);
		});

		it('uses the first sorting option to set "current" when response sorting data is not empty', () => {
			const searchData = new SearchData({ search: 'dressSorting' });
			const sort = new SortingStore(services, searchData.sorting, searchData.search, searchData.meta);
			const sortingData = searchData.meta.sortOptions;

			expect(sort.options).toHaveLength(sortingData.length);

			expect(sort.current).toBeDefined();
			expect(sort.current.field).toBe(searchData.sorting[0].field);
			expect(sort.current.direction).toBe(searchData.sorting[0].direction);
		});
	});
});
