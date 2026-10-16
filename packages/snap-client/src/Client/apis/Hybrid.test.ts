import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { HybridAPI } from './Hybrid';
import { MockData } from '@searchspring/snap-shared';
import { BEACON_PARAM, NO_BEACON_PARAM } from '../transforms';

const mockData = new MockData();

describe('Hybrid Api', () => {
	it('has expected default functions', () => {
		const api = new HybridAPI(new ApiConfiguration({}));

		//@ts-ignore
		expect(api?.requesters).toBeDefined();

		//@ts-ignore
		expect(api?.requesters.legacy).toBeDefined();

		//@ts-ignore
		expect(api?.requesters.suggest).toBeDefined();

		expect(api?.getSearch).toBeDefined();

		expect(api?.getAutocomplete).toBeDefined();

		expect(api?.getMeta).toBeDefined();
	});

	it('can call getMeta', async () => {
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const api = new HybridAPI(new ApiConfiguration({}));

		const params = { body: undefined, headers: {}, method: 'GET' };
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/meta/meta.json?siteId=8uyt2m';

		await api.getMeta({
			siteId: '8uyt2m',
		});
		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockReset();
	});

	it('can call getSearch', async () => {
		const api = new HybridAPI(new ApiConfiguration({}));
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.search()) } as Response));

		const params = {
			body: undefined,
			headers: {},
			method: 'GET',
		};
		const fetchUrl = `https://8uyt2m.a.searchspring.io/api/search/search.json?siteId=8uyt2m&${BEACON_PARAM}=true&ajaxCatalog=Snap&resultsFormat=native`;

		await api.getSearch({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(fetchUrl, params);

		requestMock.mockReset();
	});

	it('can call getAutcomplete', async () => {
		const api = new HybridAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.autocomplete()) } as Response));

		const params = {
			body: undefined,
			headers: {},
			method: 'GET',
		};
		const cacheKey =
			'https://8uyt2m.a.searchspring.io/api/suggest/query?siteId=8uyt2m&language=en&query=undefined&suggestionCount=5&disableSpellCorrect=true';

		await api.getAutocomplete({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(cacheKey, params);

		requestMock.mockReset();
	});

	describe('beacon request option', () => {
		const params = {
			body: undefined,
			headers: {},
			method: 'GET',
		};

		it.each([
			['getSearch', 'search'],
			['getCategory', 'category'],
			['getFinder', 'finder'],
		] as const)('%s sends the no beacon param instead of the beacon param when beacon is false', async (method, endpoint) => {
			const api = new HybridAPI(new ApiConfiguration({}));
			const requestMock = jest
				.spyOn(global.window, 'fetch')
				.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.search()) } as Response));

			await api[method]({ siteId: '8uyt2m', search: { query: { string: 'untracked' } } }, { beacon: false });

			expect(requestMock).toHaveBeenCalledTimes(1);
			expect(requestMock).toHaveBeenCalledWith(
				`https://8uyt2m.a.searchspring.io/api/search/${endpoint}.json?siteId=8uyt2m&q=untracked&${NO_BEACON_PARAM}=true&ajaxCatalog=Snap&resultsFormat=native`,
				params
			);

			requestMock.mockReset();
		});

		it('getAutocomplete sends the no beacon param instead of the beacon param when beacon is false', async () => {
			const api = new HybridAPI(new ApiConfiguration({}));
			const requestMock = jest
				.spyOn(global.window, 'fetch')
				.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.autocomplete()) } as Response))
				// suggest response determines the autocomplete query
				.mockImplementationOnce(() => Promise.resolve({ status: 200, json: () => Promise.resolve({ query: 'untracked' }) } as Response));

			await api.getAutocomplete({ siteId: '8uyt2m', search: { query: { string: 'untracked' } } }, { beacon: false });

			// first request is to suggest, second is the autocomplete request that carries the beacon param
			expect(requestMock).toHaveBeenCalledTimes(2);
			expect(requestMock).toHaveBeenNthCalledWith(
				2,
				`https://8uyt2m.a.searchspring.io/api/search/autocomplete.json?siteId=8uyt2m&q=untracked&${NO_BEACON_PARAM}=true&redirectResponse=full&ajaxCatalog=Snap&resultsFormat=native`,
				params
			);

			requestMock.mockReset();
		});

		it('does not answer a tracked request from the cache entry of an untracked request', async () => {
			// jsdom lacks performance.getEntriesByType, which NetworkCache reads before returning a cached entry
			Object.defineProperty(window.performance, 'getEntriesByType', {
				value: jest.fn().mockReturnValue([{ type: 'navigate' }]),
				writable: true,
				configurable: true,
			});

			const api = new HybridAPI(new ApiConfiguration({}));
			const requestMock = jest
				.spyOn(global.window, 'fetch')
				.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.search()) } as Response));

			const request = { siteId: '8uyt2m', search: { query: { string: 'cached' } } };

			await api.getSearch(request, { beacon: false });
			await api.getSearch(request, { beacon: false });

			// repeated untracked request is served from the cache
			expect(requestMock).toHaveBeenCalledTimes(1);
			expect(requestMock).toHaveBeenLastCalledWith(
				`https://8uyt2m.a.searchspring.io/api/search/search.json?siteId=8uyt2m&q=cached&${NO_BEACON_PARAM}=true&ajaxCatalog=Snap&resultsFormat=native`,
				params
			);

			await api.getSearch(request);

			expect(requestMock).toHaveBeenCalledTimes(2);
			expect(requestMock).toHaveBeenLastCalledWith(
				`https://8uyt2m.a.searchspring.io/api/search/search.json?siteId=8uyt2m&q=cached&${BEACON_PARAM}=true&ajaxCatalog=Snap&resultsFormat=native`,
				params
			);

			requestMock.mockReset();
			// @ts-ignore - removing the stub added above
			delete window.performance.getEntriesByType;
		});
	});
});
