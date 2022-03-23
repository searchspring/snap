import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { SuggestAPI } from './Suggest';

describe('Suggest Api', () => {
	it('has expected default functions', () => {
		let api;

		expect(() => {
			api = new SuggestAPI(new ApiConfiguration({}));
		}).not.toThrow();

		expect(api.getSuggest).toBeDefined();

		expect(api.postSuggest).toBeDefined();

		expect(api.getTrending).toBeDefined();

		expect(api.postTrending).toBeDefined();
	});

	it('can call getSuggest', () => {
		let api = new SuggestAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			headers: {},
			method: 'GET',
			path: '/api/suggest/query',
			query: {
				query: 'dress',
				siteId: '8uyt2m',
			},
		};
		const cacheKey = '/api/suggest/query{"siteId":"8uyt2m","query":"dress"}';

		api.getSuggest({
			siteId: '8uyt2m',
			query: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call postSuggest', () => {
		let api = new SuggestAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;

		const params = {
			body: {
				query: 'dress',
				siteId: '8uyt2m',
			},
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			path: '/api/suggest/query',
		};
		const cacheKey = '/api/suggest/query{"siteId":"8uyt2m","query":"dress"}';

		api.postSuggest({
			siteId: '8uyt2m',
			query: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call getTrending', () => {
		let api = new SuggestAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;

		const params = {
			headers: {},
			method: 'GET',
			path: '/api/suggest/trending',
			query: {
				siteId: '8uyt2m',
				limit: 4,
			},
		};
		const cacheKey = '/api/suggest/trending{"siteId":"8uyt2m","limit":4}';

		api.getTrending({
			siteId: '8uyt2m',
			limit: 4,
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call postTrending', () => {
		let api = new SuggestAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;

		const params = {
			body: {
				limit: 4,
				siteId: '8uyt2m',
			},
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			path: '/api/suggest/trending',
		};
		const cacheKey = '/api/suggest/trending{"siteId":"8uyt2m","limit":4}';

		api.postTrending({
			siteId: '8uyt2m',
			limit: 4,
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});
});
