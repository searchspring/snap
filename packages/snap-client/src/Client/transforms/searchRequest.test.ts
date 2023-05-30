import { SearchRequestModelFilterValue, SearchRequestModelFilterRange, SearchRequestModelFilter } from '@searchspring/snapi-types';

import { transformSearchRequest } from './searchRequest';

const mockRequest = {
	sorts: [{ field: 'name', direction: 'asc' as any }],
	search: {
		query: {
			string: 'red dress',
		},
	},
};

describe('search request transformer', () => {
	it('returns search params merged from transformed request', () => {
		const searchRequest = transformSearchRequest(mockRequest);

		expect(Object.keys(searchRequest)).toEqual(['q', 'sort.name']);
	});
});

describe('search request sort transform', () => {
	it('returns empty object if request missing', () => {
		const params = transformSearchRequest.sorts();

		expect(params).toEqual({});
	});

	it('returns empty object if empty params', () => {
		const params = transformSearchRequest.sorts({
			sorts: [{ field: '', direction: undefined }],
		});

		expect(params).toEqual({});
	});

	it('generates sort params', () => {
		const params = transformSearchRequest.sorts({
			sorts: [
				{
					field: 'name_field',
					direction: 'desc' as any,
				},
				{
					field: 'price_field',
					direction: 'asc' as any,
				},
			],
		});

		expect(params).toEqual({ 'sort.name_field': ['desc'], 'sort.price_field': ['asc'] });
	});

	it('returns empty object if param missing', () => {
		const params = transformSearchRequest.sorts({});

		expect(params).toEqual({});
	});

	it('returns empty object if params are invalid', () => {
		//missing field or direction
		const params1 = transformSearchRequest.sorts({ sorts: [{ field: 'a_field' }] });
		const params2 = transformSearchRequest.sorts({ sorts: [{ direction: 'desc' as any }] });
		// incorrect direction
		const params3 = transformSearchRequest.sorts({ sorts: [{ field: 'a_field', direction: 'descending' as any }] });

		expect(params1).toEqual({});
		expect(params2).toEqual({});
		expect(params3).toEqual({});
	});
});

describe('search request search transform', () => {
	it('returns empty object if request missing', () => {
		const params = transformSearchRequest.search();

		expect(params).toEqual({});
	});

	it('returns empty object if param missing', () => {
		const params = transformSearchRequest.search({});

		expect(params).toEqual({});
	});

	it('should not trim query', () => {
		const params = transformSearchRequest.search({
			search: {
				query: {
					string: ' a query ',
				},
			},
		});

		expect(params.q).toEqual(' a query ');
	});

	it('generates trimmed subQuery parameter', () => {
		const params = transformSearchRequest.search({
			search: {
				subQuery: ' a subquery ',
			},
		});

		expect(params.rq).toEqual('a subquery');
	});

	it('generates redirectResponse parameter', () => {
		const params = transformSearchRequest.search({
			search: {
				redirectResponse: 'full' as any,
			},
		});

		expect(params.redirectResponse).toEqual('full');
	});

	it('generates trimmed fallbackQuery parameter', () => {
		const params = transformSearchRequest.search({
			search: {
				fallbackQuery: ' a fallback query ',
			},
		});

		expect(params.fallbackQuery).toEqual('a fallback query');
	});
});

describe('search request filter transform', () => {
	it('returns empty object if request missing', () => {
		const params = transformSearchRequest.filters();

		expect(params).toEqual({});
	});

	it('adds fg filters', () => {
		const params = transformSearchRequest.filters({
			filters: [
				{ type: 'value' as any, field: 'color', value: 'blue' } as SearchRequestModelFilterValue,
				{ type: 'value' as any, field: 'color', value: 'red', background: false } as SearchRequestModelFilterValue,
			],
		});

		expect(params).toEqual({ 'filter.color': ['blue', 'red'] });
	});

	it('adds bg filters', () => {
		const params = transformSearchRequest.filters({
			filters: [
				{
					type: 'value' as any,
					field: 'color',
					value: 'blue',
					background: true,
				} as SearchRequestModelFilterValue,
				{
					type: 'value' as any,
					field: 'color',
					value: 'orange',
					background: true,
				} as SearchRequestModelFilterValue,
			],
		});

		expect(params).toEqual({ 'bgfilter.color': ['blue', 'orange'] });
	});

	it('handles range filters', () => {
		const params = transformSearchRequest.filters({
			filters: [
				{
					type: 'range',
					field: 'price',
					value: {
						low: undefined,
						high: 50,
					},
				} as SearchRequestModelFilterRange,
				{
					type: 'range',
					field: 'width',
					value: {
						low: 25,
					},
					background: true,
				} as SearchRequestModelFilterRange,
				{
					type: 'range',
					field: 'height',
					value: {
						high: 30,
					},
					background: true,
				} as SearchRequestModelFilterRange,
				,
			] as SearchRequestModelFilter[],
		});

		expect(params).toEqual({
			'filter.price.low': ['*'],
			'filter.price.high': [50],
			'bgfilter.width.low': [25],
			'bgfilter.width.high': ['*'],
			'bgfilter.height.low': ['*'],
			'bgfilter.height.high': [30],
		});
	});

	it('ignores filters that do not specify a type', () => {
		const params = transformSearchRequest.filters({
			filters: [
				{ field: 'color', value: 'blue' } as SearchRequestModelFilterValue,
				{ field: 'color', value: 'red', background: false } as SearchRequestModelFilterValue,
			],
		});

		expect(params).toEqual({});
	});
});

describe('search request merchandising transform', () => {
	it('returns empty object if request missing', () => {
		const params = transformSearchRequest.merchandising();

		expect(params).toEqual({});
	});

	it('disables merchandising', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				disabled: true,
			},
		});

		expect(params).toEqual({ disableMerchandising: true });
	});

	it('transforms landing page param', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				landingPage: 'some-landing-page',
			},
		});

		expect(params).toEqual({ 'landing-page': 'some-landing-page' });
	});

	it('adds landing page even if merchandising is disabled', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				disabled: true,
				landingPage: 'some-landing-page',
			},
		});

		expect(params).toEqual({ 'landing-page': 'some-landing-page', disableMerchandising: true });
	});

	it('transforms a single segemented merchandising param', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				segments: ['some-segment'],
			},
		});

		expect(params).toEqual({ tag: ['merch.segment/some-segment'] });
	});

	it('transforms multiple segemented merchandising params', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				segments: ['some-segment', 'some-other-segment'],
			},
		});

		expect(params).toEqual({ tag: ['merch.segment/some-segment', 'merch.segment/some-other-segment'] });
	});

	it('adds segemented merchandising even if merchandising is disabled', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				disabled: true,
				segments: ['some-segment'],
			},
		});

		expect(params).toEqual({ tag: ['merch.segment/some-segment'], disableMerchandising: true });
	});

	it('can disable intellisuggest elevations', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				intellisuggest: false,
			},
		});

		expect(params).toEqual({ intellisuggest: false });
	});

	it('can disable intellisuggest elevations even if merchandising is disabled', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				disabled: true,
				intellisuggest: false,
			},
		});

		expect(params).toEqual({ disableMerchandising: true, intellisuggest: false });
	});

	it('can disable inlineBanners', () => {
		const params = transformSearchRequest.merchandising({
			merchandising: {
				disableInlineBanners: true,
			},
		});

		expect(params).toEqual({ disableInlineBanners: true });
	});
});

describe('search request pagination transform', () => {
	it('returns empty object if request missing', () => {
		const params = transformSearchRequest.pagination();

		expect(params).toEqual({});
	});

	it('adds page number', () => {
		const params = transformSearchRequest.pagination({
			pagination: {
				page: 7,
			},
		});

		expect(params).toEqual({ page: 7 });
	});

	it('adds resultsPerPage', () => {
		const params = transformSearchRequest.pagination({
			pagination: {
				pageSize: 48,
			},
		});

		expect(params).toEqual({ resultsPerPage: 48 });
	});
});

describe('search request siteId transform', () => {
	it('returns empty object if request missing', () => {
		const params = transformSearchRequest.siteId();

		expect(params).toEqual({});
	});

	it('adds siteId param', () => {
		const params = transformSearchRequest.siteId({
			siteId: 'abc123',
		});

		expect(params).toEqual({ siteId: 'abc123' });
	});
});

describe('request facets transform', () => {
	it('adds included facets', () => {
		const params = transformSearchRequest.facets({
			facets: {
				include: ['color', 'width'],
			},
		});

		expect(params).toEqual({ includedFacets: ['color', 'width'] });
	});

	it('adds excluded facets', () => {
		const params = transformSearchRequest.facets({
			facets: {
				exclude: ['size', 'weight'],
			},
		});

		expect(params).toEqual({ excludedFacets: ['size', 'weight'] });
	});

	it('throws if has both included and excluded contain values', () => {
		expect(() => {
			transformSearchRequest.facets({
				facets: {
					include: ['facet1'],
					exclude: ['facet2'],
				},
			});
		}).toThrow();
	});

	it('returns empty if neither', () => {
		const p0 = transformSearchRequest.facets();
		const p1 = transformSearchRequest.facets({});
		const p2 = transformSearchRequest.facets({ facets: {} });

		expect(p0).toEqual({});
		expect(p1).toEqual({});
		expect(p2).toEqual({});
	});

	it(`can toggle 'disableFacetDrillDown'`, () => {
		const params = transformSearchRequest.facets({
			facets: {
				autoDrillDown: false,
			},
		});

		expect(params).toEqual({ disableFacetDrillDown: true });
	});

	it(`does not set 'disableFacetDrillDown' as false`, () => {
		const params = transformSearchRequest.facets({
			facets: {
				autoDrillDown: true,
			},
		});

		expect(params).toEqual({});
	});
});
