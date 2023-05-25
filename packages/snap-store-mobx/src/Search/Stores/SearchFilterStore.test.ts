import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { SearchFilterStore, RangeFilter, Filter } from './SearchFilterStore';
import {
	SearchResponseModel,
	MetaResponseModel,
	MetaResponseModelFacetDefaults,
	MetaResponseModelFacet,
	SearchResponseModelFilter,
	SearchResponseModelFilterRange,
	SearchResponseModelFilterValue,
} from '@searchspring/snapi-types';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('Filter Store', () => {
	let searchData: SearchResponseModel & { meta: MetaResponseModel };
	beforeEach(() => {
		expect.hasAssertions();

		searchData = mockData.searchMeta('filtered');
	});

	it('has a symbol species of Array', () => {
		expect(SearchFilterStore[Symbol.species]).toBe(Array);
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		// @ts-ignore
		const filters = new SearchFilterStore(undefined, undefined, undefined);

		expect(filters.length).toBe(0);
	});

	it('returns an empty array when passed empty data', () => {
		const filters = new SearchFilterStore(services, [], {});

		expect(filters.length).toBe(0);
	});

	it('will have filter data that matches what was passed in', () => {
		const filtersInput = searchData.filters;
		const filters = new SearchFilterStore(services, filtersInput, searchData.meta);

		// check filter values
		filters.forEach((filter, index) => {
			const facetField = (filtersInput && filtersInput[index].field) || '';
			const facetMetaData: (MetaResponseModelFacet & MetaResponseModelFacetDefaults) | undefined =
				searchData.meta.facets && searchData.meta.facets[facetField];

			expect(filter.facet.field).toBe(facetField);
			expect(filter.facet.label).toBe(facetMetaData?.label);

			if (filtersInput && filtersInput[index].type === 'range') {
				// range
				expect((filter as RangeFilter).value.high).toBe(
					(filtersInput[index] as SearchResponseModelFilter & SearchResponseModelFilterRange).value?.high
				);
				expect((filter as RangeFilter).value.low).toBe(
					(filtersInput[index] as SearchResponseModelFilter & SearchResponseModelFilterRange).value?.low
				);
			} else {
				// value
				expect((filter as Filter).value.label).toBe(filtersInput && filtersInput[index].label);
				expect((filter as Filter).value.value).toBe(
					filtersInput && (filtersInput[index] as SearchResponseModelFilter & SearchResponseModelFilterValue).value
				);
			}
		});
	});

	it('uses the urlManager service to generate urls on the filters', () => {
		const filtersInput = searchData.filters;
		const filters = new SearchFilterStore(services, filtersInput, searchData.meta);

		// check filter values
		filters.forEach((filter) => {
			expect(filter.url.constructor.name).toStrictEqual(services.urlManager.constructor.name);
		});
	});
});
