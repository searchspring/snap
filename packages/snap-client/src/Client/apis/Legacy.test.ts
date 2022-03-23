import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { LegacyAPI } from './Legacy';

describe('Legacy Api', () => {
	it('has expected default functions', () => {
		let api;

		expect(() => {
			api = new LegacyAPI(new ApiConfiguration({}));
		}).not.toThrow();

		expect(api.getEndpoint).toBeDefined();

		expect(api.getMeta).toBeDefined();

		expect(api.getSearch).toBeDefined();

		expect(api.getAutocomplete).toBeDefined();

		expect(api.getFinder).toBeDefined();
	});

	it('can call getEndpoint', () => {
		let api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			headers: {},
			method: 'GET',
			path: '/api/search/search.json',
			query: {
				alias: '8uyt2m',
				q: 'dress',
				resultsFormat: 'native',
			},
		};
		const cacheKey = '/api/search/search.json{"alias":"8uyt2m","q":"dress","resultsFormat":"native"}';

		//@ts-ignore
		api.getEndpoint({
			alias: '8uyt2m',
			q: 'dress',
		});
		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();

		//can get endpoint with custom path
		//@ts-ignore
		api.getEndpoint(
			{
				alias: '8uyt2m',
				q: 'dress',
			},
			'mycustompath.com'
		);

		expect(requestMock).toHaveBeenCalledWith(
			{ ...params, path: 'mycustompath.com' },
			'mycustompath.com{"alias":"8uyt2m","q":"dress","resultsFormat":"native"}'
		);

		requestMock.mockReset();
	});

	it('can call postMeta', () => {
		let api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			body: {
				siteId: '8uyt2m',
			},
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			path: '/api/meta/meta.json',
		};
		const cacheKey = '/api/meta/meta.json{"siteId":"8uyt2m"}';

		api.postMeta({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call getMeta', () => {
		let api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			headers: {},
			method: 'GET',
			path: '/api/meta/meta.json',
			query: {
				siteId: '8uyt2m',
			},
		};
		const cacheKey = '/api/meta/meta.json{"siteId":"8uyt2m"}';

		api.getMeta({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call getSearch', () => {
		let api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			headers: {},
			method: 'GET',
			path: '/api/search/search.json',
			query: {
				alias: '8uyt2m',
				q: 'dress',
				resultsFormat: 'native',
			},
		};
		const cacheKey = '/api/search/search.json{"alias":"8uyt2m","q":"dress","resultsFormat":"native"}';

		api.getSearch({
			alias: '8uyt2m',
			q: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call getAutocomplete', () => {
		let api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			headers: {},
			method: 'GET',
			path: '/api/search/autocomplete.json',
			query: {
				alias: '8uyt2m',
				q: 'dress',
				resultsFormat: 'native',
			},
		};
		const cacheKey = '/api/search/autocomplete.json{"alias":"8uyt2m","q":"dress","resultsFormat":"native"}';

		api.getAutocomplete({
			alias: '8uyt2m',
			q: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call getFinder', () => {
		let api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			headers: {},
			method: 'GET',
			path: '/api/search/finder.json',
			query: {
				alias: '8uyt2m',
				q: 'dress',
				resultsFormat: 'native',
			},
		};
		const cacheKey = '/api/search/finder.json{"alias":"8uyt2m","q":"dress","resultsFormat":"native"}';

		api.getFinder({
			alias: '8uyt2m',
			q: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});
});
