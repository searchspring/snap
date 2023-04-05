import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { HybridAPI } from './Hybrid';
import { MockData } from '@searchspring/snap-shared';

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
		const api = new HybridAPI(new ApiConfiguration({}));
		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

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
		const cacheKey = 'https://8uyt2m.a.searchspring.io/api/search/search.json?siteId=8uyt2m&ajaxCatalog=Snap&resultsFormat=native';

		await api.getSearch({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(cacheKey, params);

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
});
