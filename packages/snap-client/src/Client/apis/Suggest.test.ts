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

	it('can call getSuggest', async () => {
		let api = new SuggestAPI(new ApiConfiguration({}));

		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as unknown as Response));

		const params = {
			body: undefined,
			headers: {},
			method: 'GET',
		};
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/suggest/query?siteId=8uyt2m&query=dress';

		await api.getSuggest({
			siteId: '8uyt2m',
			query: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockClear();
	});

	it('can call postSuggest', async () => {
		let api = new SuggestAPI(new ApiConfiguration({}));

		const params = {
			body: '{"siteId":"88uyt2m","query":"dress"}',
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		};
		const requestUrl = 'https://88uyt2m.a.searchspring.io/api/suggest/query';

		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as unknown as Response));

		await api.postSuggest({
			siteId: '88uyt2m',
			query: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockReset();
	});

	it('can call getTrending', async () => {
		let api = new SuggestAPI(new ApiConfiguration({}));
		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as unknown as Response));

		const params = {
			body: undefined,
			headers: {},
			method: 'GET',
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/suggest/trending?siteId=8uyt2m&limit=4';

		await api.getTrending({
			siteId: '8uyt2m',
			limit: 4,
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockReset();
	});

	it('can call postTrending', async () => {
		let api = new SuggestAPI(new ApiConfiguration({}));
		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as unknown as Response));

		const params = {
			body: '{"siteId":"8uuyt2m","limit":4}',
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		};
		const requestUrl = 'https://8uuyt2m.a.searchspring.io/api/suggest/trending';

		await api.postTrending({
			siteId: '8uuyt2m',
			limit: 4,
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockReset();
	});
});
