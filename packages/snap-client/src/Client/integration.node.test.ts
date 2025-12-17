/**
 * @jest-environment node
 */

import { Client } from '@searchspring/snap-client';

describe('Snap Client Node Integration Tests', () => {
	const globals = { siteId: '8uyt2m' };

	it('Caches search responses and uses them', async () => {
		// mock fetch implementation
		const fetchApiMock = jest
			.spyOn(global, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const client = new Client(globals);

		await client.search();

		expect(fetchApiMock).toHaveBeenCalledTimes(2);

		// second search should cause no new API requests
		await client.search();

		expect(fetchApiMock).toHaveBeenCalledTimes(2);

		fetchApiMock.mockReset();
	});

	it('Allows for supplying custom `fetchApi` in the config', async () => {
		// mock fetch
		const fetchFn = jest.spyOn(global, 'fetch');
		const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		const client = new Client(globals, { fetchApi: fetchApiMock });

		await client.search();

		expect(fetchFn).toHaveBeenCalledTimes(0);
		expect(fetchApiMock).toHaveBeenCalledTimes(2);

		fetchFn.mockReset();
	});

	describe('Client API Requests', () => {
		it(`can run 'meta'`, async () => {
			// mock fetch
			const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

			const client = new Client(globals, { fetchApi: fetchApiMock });

			await client.meta();

			expect(fetchApiMock).toHaveBeenCalledTimes(1);

			fetchApiMock.mockReset();
		});

		it(`can run 'trending'`, async () => {
			// mock fetch
			const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

			const client = new Client(globals, { fetchApi: fetchApiMock });

			await client.trending(globals);

			expect(fetchApiMock).toHaveBeenCalledTimes(1);

			fetchApiMock.mockReset();
		});

		it(`can run 'search'`, async () => {
			// mock fetch
			const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

			const client = new Client(globals, { fetchApi: fetchApiMock });

			await client.search();

			expect(fetchApiMock).toHaveBeenCalledTimes(2);

			fetchApiMock.mockReset();
		});

		it(`can run 'finder'`, async () => {
			// mock fetch
			const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

			const client = new Client(globals, { fetchApi: fetchApiMock });

			await client.finder();

			expect(fetchApiMock).toHaveBeenCalledTimes(2);

			fetchApiMock.mockReset();
		});

		it(`can run 'autocomplete'`, async () => {
			// mock fetch
			const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

			const client = new Client(globals, { fetchApi: fetchApiMock });

			const acParams = {
				search: {
					query: {
						string: 'hello',
					},
				},
			};

			await client.autocomplete(acParams);

			expect(fetchApiMock).toHaveBeenCalledTimes(3);

			fetchApiMock.mockReset();
		});

		it(`can run 'recommend'`, async () => {
			// mock fetch
			const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve([{}]) } as Response));

			const client = new Client(globals, { fetchApi: fetchApiMock });

			const recParams = { siteId: '8uyt2m', tag: 'dress' };
			await client.recommend(recParams);

			expect(fetchApiMock).toHaveBeenCalledTimes(3);

			fetchApiMock.mockReset();
		});
	});
});
