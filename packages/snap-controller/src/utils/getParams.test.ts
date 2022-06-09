import { getSearchParams } from './getParams';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

let urlManager: UrlManager;

describe('getParams', () => {
	beforeEach(() => {
		urlManager = new UrlManager(new UrlTranslator());
	});

	it('returns an empty object when passed an empty state', () => {
		const params = getSearchParams(urlManager.state);
		expect(params).toStrictEqual({});
	});

	it('creates search parameters from a UrlManager state', () => {
		const searchQuery = 'shirt';
		const filters = [
			{
				type: 'value',
				field: 'color',
				value: 'blue',
			},
			{
				type: 'value',
				field: 'size',
				value: 'large',
			},
			{
				type: 'range',
				field: 'price',
				value: { low: 0, high: 100 },
			},
		];
		const sorts = [
			{
				field: 'name',
				direction: 'desc',
			},
		];

		urlManager = urlManager.merge('query', searchQuery);
		filters.forEach((filter) => {
			urlManager = urlManager.merge(['filter', filter.field], filter.value);
		});
		sorts.forEach((sort) => {
			urlManager = urlManager.merge('sort', sort);
		});

		const params = getSearchParams(urlManager.state);
		expect(params).toStrictEqual({
			search: {
				query: {
					string: searchQuery,
				},
			},
			filters,
			sorts,
		});
	});

	it('uses "tag" from UrlManager state', () => {
		const landingPageName = 'landing';
		const params = getSearchParams(urlManager.merge('tag', landingPageName).state);

		expect(params).toStrictEqual({
			merchandising: {
				landingPage: landingPageName,
			},
		});
	});

	it('uses "rq" from UrlManager state', () => {
		const searchQuery = 'shirt';
		const subQuery = 'small';

		urlManager = urlManager.merge('query', searchQuery);
		urlManager = urlManager.merge('rq', subQuery);

		const params = getSearchParams(urlManager.state);

		expect(params).toStrictEqual({
			search: {
				query: {
					string: searchQuery,
				},
				subQuery,
			},
		});
	});

	it('uses "oq" from UrlManager state', () => {
		const searchQuery = 'shirt';
		const originalQuery = 'shit';

		urlManager = urlManager.merge('query', searchQuery);
		urlManager = urlManager.merge('oq', originalQuery);

		const params = getSearchParams(urlManager.state);

		expect(params).toStrictEqual({
			search: {
				query: {
					string: searchQuery,
				},
				originalQuery,
			},
		});
	});

	it('uses "page" from UrlManager state', () => {
		const page = 3;

		urlManager = urlManager.merge('page', page);

		const params = getSearchParams(urlManager.state);

		expect(params).toStrictEqual({
			pagination: {
				page,
			},
		});
	});

	it('uses "pageSize" from UrlManager state', () => {
		const pageSize = 30;

		urlManager = urlManager.merge('pageSize', pageSize);

		const params = getSearchParams(urlManager.state);

		expect(params).toStrictEqual({
			pagination: {
				pageSize,
			},
		});
	});
});
