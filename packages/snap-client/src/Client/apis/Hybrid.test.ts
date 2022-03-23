import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { HybridAPI } from './Hybrid';

describe('Legacy Api', () => {
	it('has expected default functions', () => {
		let api;

		expect(() => {
			api = new HybridAPI(new ApiConfiguration({}));
		}).not.toThrow();

		expect(api.requesters).toBeDefined();

		expect(api.requesters.legacy).toBeDefined();

		expect(api.requesters.suggest).toBeDefined();

		expect(api.getSearch).toBeDefined();

		expect(api.getAutocomplete).toBeDefined();

		expect(api.getMeta).toBeDefined();
	});

	it('can call getMeta', () => {
		let api = new HybridAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = { body: undefined, headers: {}, method: 'GET' };
		const cacheKey = 'https://8uyt2m.a.searchspring.io/api/meta/meta.json?siteId=8uyt2m';

		api.getMeta({
			siteId: '8uyt2m',
		});
		expect(requestMock).toHaveBeenCalledWith(cacheKey, params);

		requestMock.mockReset();
	});

	it('can call getSearch', async () => {
		let api = new HybridAPI(new ApiConfiguration({}));
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ json: () => Promise.resolve({}) } as unknown as Response));

		//@ts-ignore
		api.request = requestMock;
		//@ts-ignore
		api.requesters.legacy.request = requestMock;

		const params = {
			headers: {},
			method: 'GET',
			path: '/api/search/search.json',
			query: {
				resultsFormat: 'native',
				siteId: ['8uyt2m'],
			},
		};
		const cacheKey = '/api/search/search.json{"siteId":["8uyt2m"],"resultsFormat":"native"}';

		await api.getSearch({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call getAutcomplete', () => {
		let api = new HybridAPI(new ApiConfiguration({}));

		const ACRequestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ json: () => Promise.resolve({}) } as unknown as Response));
		const SuggestRequestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ json: () => Promise.resolve({}) } as unknown as Response));

		//@ts-ignore
		api.request = ACRequestMock;
		//@ts-ignore
		api.requesters.suggest.request = SuggestRequestMock;
		//@ts-ignore
		api.requesters.legacy.request = ACRequestMock;

		const params = {
			headers: {},
			method: 'GET',
			path: '/api/suggest/query',
			query: {
				disableSpellCorrect: true,
				language: 'en',
				query: undefined,
				siteId: ['8uyt2m'],
				suggestionCount: 5,
			},
		};
		const cacheKey = '/api/suggest/query{"siteId":["8uyt2m"],"language":"en","suggestionCount":5,"disableSpellCorrect":true}';

		api.getAutocomplete({
			siteId: '8uyt2m',
		});

		expect(SuggestRequestMock).toHaveBeenCalled();
		expect(ACRequestMock).toHaveBeenCalledWith(params, cacheKey);

		ACRequestMock.mockReset();
	});
});
