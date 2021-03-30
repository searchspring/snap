import { SortingStore } from './SortingStore';

import { SearchData } from '../../__mocks__/SearchData';
import { mockSearchController } from '../../__mocks__/mockControllers';

describe('Sorting Store', () => {
	let searchData;
	beforeEach(() => {
		expect.hasAssertions();

		searchData = new SearchData();
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		const sort = new SortingStore(undefined, undefined, undefined);
		expect(sort.options.length).toBe(0);
	});

	it('returns an empty array when nothing is passed as sorting', () => {
		const sort = new SortingStore(mockSearchController, undefined, searchData.meta);
		expect(sort.options.length).toBeGreaterThan(0);
	});

	it('uses the meta data to construct its options', () => {
		const sort = new SortingStore(mockSearchController, undefined, searchData.meta);
		const sortingData = searchData.meta.sortOptions;

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
		const searchData = new SearchData({ search: 'sorting' });
		const sort = new SortingStore(mockSearchController, undefined, searchData.meta);
		const sortingData = searchData.meta.sortOptions;

		expect(sort.current).toBeDefined();
		expect(sort.current.field).toBe(sortingData[0].field);
		expect(sort.current.direction).toBe(sortingData[0].direction);
	});

	it('uses the search response sorting data to set the "current" sort', () => {
		const searchData = new SearchData({ search: 'sorting' });
		const sort = new SortingStore(mockSearchController, searchData.sorting, searchData.meta);

		expect(sort.current).toBeDefined();
		expect(sort.current.field).toBe(searchData.sorting[0].field);
		expect(sort.current.direction).toBe(searchData.sorting[0].direction);
	});
});
