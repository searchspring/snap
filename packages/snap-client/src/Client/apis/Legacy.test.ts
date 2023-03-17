import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { LegacyAPI } from './Legacy';

describe('Legacy Api', () => {
	it('has expected default functions', () => {
		const api = new LegacyAPI(new ApiConfiguration({}));

		// @ts-ignore
		expect(api?.getEndpoint).toBeDefined();

		expect(api?.getMeta).toBeDefined();

		expect(api?.getSearch).toBeDefined();

		expect(api?.getAutocomplete).toBeDefined();

		expect(api?.getFinder).toBeDefined();
	});

	it('can call getMeta', async () => {
		const api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const params = {
			headers: {},
			method: 'GET',
		};
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/meta/meta.json?siteId=8uyt2m';

		await api.getMeta({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);
	});

	it('can call getSearch', async () => {
		const api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const params = {
			headers: {},
			method: 'GET',
		};
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/search/search.json?siteId=8uyt2m&q=dress&resultsFormat=native';

		await api.getSearch({
			siteId: '8uyt2m',
			q: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);
	});

	it('can call postMeta', async () => {
		const api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const params = {
			body: '{"siteId":"88uyt2m"}',
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		};
		const reuestUrl = 'https://88uyt2m.a.searchspring.io/api/meta/meta.json';

		await api.postMeta({
			siteId: '88uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(reuestUrl, params);
	});

	it('can call getAutocomplete', async () => {
		const api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const params = {
			headers: {},
			method: 'GET',
		};
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/search/autocomplete.json?siteId=8uyt2m&q=dress&resultsFormat=native';

		await api.getAutocomplete({
			siteId: '8uyt2m',
			q: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);
	});

	it('can call getFinder', async () => {
		const api = new LegacyAPI(new ApiConfiguration({}));
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const params = {
			headers: {},
			method: 'GET',
		};
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/search/finder.json?siteId=8uyt2m&q=dress&resultsFormat=native';

		await api.getFinder({
			siteId: '8uyt2m',
			q: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);
	});

	it('can call getEndpoint', async () => {
		const api = new LegacyAPI(new ApiConfiguration({}));

		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const params = {
			body: undefined,
			headers: {},
			method: 'GET',
		};
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/search/search.json?siteId=8uyt2m&q=dress&resultsFormat=native';

		//@ts-ignore
		await api.getEndpoint({
			siteId: '8uyt2m',
			q: 'dress',
		});
		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockReset();

		requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		//can get endpoint with custom path
		//@ts-ignore
		await api.getEndpoint(
			{
				siteId: '8uyt2m',
				q: 'dress',
			},
			'mycustompath.com'
		);

		expect(requestMock).toHaveBeenCalledWith('https://8uyt2m.a.searchspring.io/mycustompath.com?siteId=8uyt2m&q=dress&resultsFormat=native', {
			...params,
		});

		requestMock.mockReset();
	});
});
