import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { SnapAPI } from './Snap';

describe('Snap Api', () => {
	it('has expected default functions', () => {
		let api;

		expect(() => {
			api = new SnapAPI(new ApiConfiguration({}));
		}).not.toThrow();

		expect(api.postMeta).toBeDefined();

		expect(api.postSearch).toBeDefined();

		expect(api.postAutocomplete).toBeDefined();
	});

	it('can call postMeta', () => {
		let api = new SnapAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const metaParams = {
			body: {
				siteId: '8uyt2m',
			},
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			path: '/api/v1/meta',
		};
		const cacheKey = '/api/v1/meta{"siteId":"8uyt2m"}';

		api.postMeta({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(metaParams, cacheKey);

		requestMock.mockReset();
	});

	it('can call postSearch', () => {
		let api = new SnapAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;

		const searchParams = {
			body: {},
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			path: '/api/v1/search',
		};
		const cacheKey = '/api/v1/search{}';

		api.postSearch({});

		expect(requestMock).toHaveBeenCalledWith(searchParams, cacheKey);

		requestMock.mockReset();
	});

	it('can call postAutocomplete', () => {
		let api = new SnapAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;

		const searchParams = {
			body: {},
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			path: '/api/v1/autocomplete',
		};
		const cacheKey = '/api/v1/autocomplete{}';

		api.postAutocomplete({});

		expect(requestMock).toHaveBeenCalledWith(searchParams, cacheKey);

		requestMock.mockReset();
	});
});
