import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { FilterStore } from './FilterStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('Filter Store', () => {
	let searchData;
	beforeEach(() => {
		expect.hasAssertions();

		searchData = mockData.searchMeta('filtered');
	});

	it('has a symbol species of Array', () => {
		expect(FilterStore[Symbol.species]).toBe(Array);
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		const filters = new FilterStore(undefined, undefined, undefined);

		expect(filters.length).toBe(0);
	});

	it('returns an empty array when passed empty data', () => {
		const filters = new FilterStore(services, [], {});

		expect(filters.length).toBe(0);
	});

	it('will have filter data that matches what was passed in', () => {
		const filtersInput = searchData.filters;
		const filters = new FilterStore(services, filtersInput, searchData.meta);

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

	it('uses the urlManager service to generate urls on the filters', () => {
		const filtersInput = searchData.filters;
		const filters = new FilterStore(services, filtersInput, searchData.meta);

		// check filter values
		filters.forEach((filter, index) => {
			expect(filter.url.constructor.name).toStrictEqual(services.urlManager.constructor.name);
		});
	});
});
