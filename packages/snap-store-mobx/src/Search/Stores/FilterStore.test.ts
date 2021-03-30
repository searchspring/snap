import { FilterStore } from './FilterStore';

import { SearchData } from '../../__mocks__/SearchData';
import { mockSearchController } from '../../__mocks__/mockControllers';
describe('Filter Store', () => {
	let searchData;
	beforeEach(() => {
		expect.hasAssertions();

		searchData = new SearchData({ search: 'filtered' });
	});

	it('has a symbol species of Array', () => {
		expect(FilterStore[Symbol.species]).toBe(Array);
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		const filters = new FilterStore(undefined, undefined, undefined);

		expect(filters.length).toBe(0);
	});

	it('returns an empty array when passed empty data', () => {
		const filters = new FilterStore(mockSearchController, [], {});

		expect(filters.length).toBe(0);
	});

	it('passes a reference of the controller to each filter', () => {
		const filters = new FilterStore(mockSearchController, searchData.filters, searchData.meta);

		for (const filter of filters) {
			expect(filter.controller).toStrictEqual(mockSearchController);
		}
	});

	it('will have filter data that matches what was passed in', () => {
		const filtersInput = searchData.filters;
		const filters = new FilterStore(mockSearchController, filtersInput, searchData.meta);

		// check filter values
		filters.forEach((filter, index) => {
			const facetField = filtersInput[index].field;
			const facetMetaData = searchData.meta.facets[facetField];

			expect(filter.facet.field).toBe(facetField);
			expect(filter.facet.label).toBe(facetMetaData.label);

			if (filtersInput[index].type === 'range') {
				// range
				expect(filter.value.high).toBe(filtersInput[index].value.high);
				expect(filter.value.low).toBe(filtersInput[index].value.low);
			} else {
				// value
				expect(filter.value.label).toBe(filtersInput[index].label);
				expect(filter.value.value).toBe(filtersInput[index].value);
			}
		});
	});
});
