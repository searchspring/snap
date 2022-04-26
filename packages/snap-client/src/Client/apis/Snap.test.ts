import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { SnapAPI } from './Snap';

describe('Snap Api', () => {
	it('has expected default functions', () => {
		let api = new SnapAPI(new ApiConfiguration({}));

		expect(api?.postMeta).toBeDefined();

		expect(api?.postSearch).toBeDefined();

		expect(api?.postAutocomplete).toBeDefined();
	});

	it('can call postMeta', async () => {
		let api = new SnapAPI(new ApiConfiguration({}));
		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const metaParams = {
			body: '{"siteId":"8uyt2m"}',
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/v1/meta';

		await api.postMeta({
			siteId: '8uyt2m',
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, metaParams);

		requestMock.mockReset();
	});

	it('can call postSearch', async () => {
		let api = new SnapAPI(new ApiConfiguration({}));
		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const searchParams = {
			body: '{"siteId":"8uyt2m"}',
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		};
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/v1/search';

		await api.postSearch({ siteId: '8uyt2m' });

		expect(requestMock).toHaveBeenCalledWith(requestUrl, searchParams);

		requestMock.mockReset();
	});

	it('can call postAutocomplete', async () => {
		let api = new SnapAPI(new ApiConfiguration({}));
		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const searchParams = {
			body: '{"siteId":"8uyt2m"}',
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		};
		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/v1/autocomplete';

		await api.postAutocomplete({ siteId: '8uyt2m' });

		expect(requestMock).toHaveBeenCalledWith(requestUrl, searchParams);

		requestMock.mockReset();
	});
});
