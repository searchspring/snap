import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { RecommendAPI } from './Recommend';
import { MockData } from '@searchspring/snap-shared';

import type { PostRecommendAPISpec } from '../../types';

const mockData = new MockData();

const wait = (time?: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('Recommend Api', () => {
	it('has expected default functions', () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		// @ts-ignore - accessing private property
		expect(api?.batches).toBeDefined();

		expect(api?.getProfile).toBeDefined();

		expect(api?.batchRecommendations).toBeDefined();

		expect(api?.postRecommendations).toBeDefined();
	});

	it('can call getProfile', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			body: undefined,
			headers: {},
			method: 'GET',
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/personalized-recommendations/profile.json?siteId=8uyt2m&tag=dress';

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		await api.getProfile({
			siteId: '8uyt2m',
			tag: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockClear();
	});

	it('can call postRecommendations', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			method: 'POST',
			body: '{"siteId":"8uyt2m","profiles":[{"tag":"dress"}]}',
			headers: {
				'Content-Type': 'text/plain',
			},
		};

		const requestParameters: PostRecommendAPISpec = {
			siteId: '8uyt2m',
			profiles: [
				{
					tag: 'dress',
				},
			],
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend';

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		await api.postRecommendations(requestParameters);

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockClear();
	});

	it('can call batchRecommendations', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: `{"profiles":[{"tag":"similar","limit":20}],"siteId":"8uyt2m"}`,
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend';

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		await api.batchRecommendations({
			siteId: '8uyt2m',
			tag: 'similar',
		});

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);
		requestMock.mockReset();
	});

	const batchParams = {
		siteId: '8uyt2m',
		lastViewed: [
			'marnie-runner-2-7x10',
			'ruby-runner-2-7x10',
			'abbie-runner-2-7x10',
			'riley-4x6',
			'joely-5x8',
			'helena-4x6',
			'kwame-4x6',
			'sadie-4x6',
			'candice-runner-2-7x10',
			'esmeray-4x6',
			'camilla-230x160',
			'candice-4x6',
			'sahara-4x6',
			'dayna-4x6',
			'moema-4x6',
		],
		product: 'marnie-runner-2-7x10',
	};

	const RequestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend';

	it('batchRecommendations batches as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({
			tag: 'similar',
			limits: 14,
			batched: true,
			...batchParams,
		});

		api.batchRecommendations({
			tag: 'crossSell',
			limits: 10,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"similar","limit":14},{"tag":"crossSell","limit":10}],"siteId":"8uyt2m","product":"marnie-runner-2-7x10","lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles multiple categories as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//shirt category
		api.batchRecommendations({
			tag: 'similar',
			categories: ['shirts'],
			limits: 14,
			batched: true,
			...batchParams,
		});
		//no category
		api.batchRecommendations({
			tag: 'crossSell',
			limits: 10,
			batched: true,
			...batchParams,
		});
		//pants category
		api.batchRecommendations({
			tag: 'crossSell',
			categories: ['pants'],
			limits: 10,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"similar","categories":["shirts"],"limit":14},{"tag":"crossSell","limit":10},{"tag":"crossSell","categories":["pants"],"limit":10}],"siteId":"8uyt2m","product":"marnie-runner-2-7x10","lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles multiple brands as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//shirt category
		api.batchRecommendations({
			tag: 'similar',
			brands: ['shirts'],
			limits: 14,
			batched: true,
			...batchParams,
		});
		//pants category
		api.batchRecommendations({
			tag: 'crossSell',
			brands: ['pants', 'pants2'],
			limits: 10,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"similar","brands":["shirts"],"limit":14},{"tag":"crossSell","brands":["pants","pants2"],"limit":10}],"siteId":"8uyt2m","product":"marnie-runner-2-7x10","lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles order prop as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//shirt category
		api.batchRecommendations({
			tag: 'similar',
			categories: ['shirts'],
			limits: 14,
			order: 3,
			batched: true,
			...batchParams,
		});
		//no order
		api.batchRecommendations({
			tag: 'crossSell',
			limits: 10,
			batched: true,
			...batchParams,
		});
		//no category
		api.batchRecommendations({
			tag: 'crossSell',
			limits: 10,
			order: 2,
			batched: true,
			...batchParams,
		});
		//pants category
		api.batchRecommendations({
			tag: 'crossSell',
			categories: ['pants'],
			limits: 10,
			order: 1,
			batched: true,
			...batchParams,
		});

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"crossSell","categories":["pants"],"limit":10},{"tag":"crossSell","limit":10},{"tag":"similar","categories":["shirts"],"limit":14},{"tag":"crossSell","limit":10}],"siteId":"8uyt2m","product":"marnie-runner-2-7x10","lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations resolves in right order with order prop', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));
		const response = mockData.file('recommend/results/8uyt2m/ordered.json');

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(response) } as Response));

		const promise1 = api.batchRecommendations({
			tag: 'similar',
			categories: ['shirts'],
			limits: 10,
			order: 2,
			batched: true,
			...batchParams,
		});

		const promise2 = api.batchRecommendations({
			tag: 'crosssell',
			categories: ['dress'],
			limits: 20,
			order: 1,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"crosssell","categories":["dress"],"limit":20},{"tag":"similar","categories":["shirts"],"limit":10}],"siteId":"8uyt2m","product":"marnie-runner-2-7x10","lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);

		const [response1, response2] = await Promise.all([promise1, promise2]);

		expect(response1[0].results.length).toBe(response[1].results.length);
		expect(response2[0].results.length).toBe(response[0].results.length);

		requestMock.mockReset();
	});

	it('batchRecommendations handles filters expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({
			tag: 'crossSell',
			limits: 10,
			filters: [
				{
					type: 'value',
					field: 'color',
					value: 'red',
				},
			],
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);
		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"crossSell","limit":10}],"siteId":"8uyt2m","product":"marnie-runner-2-7x10","lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"],"filters":[{"field":"color","type":"=","values":["red"]}]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles undefined limit', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//now consts try with no limit
		api.batchRecommendations({
			tag: 'crossSell',
			...batchParams,
			limits: undefined,
		});

		//add delay for paramBatch.timeout
		await wait(250);
		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"crossSell","limit":20}],"siteId":"8uyt2m","product":"marnie-runner-2-7x10","lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations will combine `product` and `products` params into `products` when used together', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({ tag: 'crossSell', products: ['some_sku', 'some_sku2'], ...batchParams });

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"crossSell","limit":20}],"siteId":"8uyt2m","products":["some_sku","some_sku2","marnie-runner-2-7x10"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations will utilize the `blockedItems` parameter when provided', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({ tag: 'crossSell', blockedItems: ['blocked_sku1', 'blocked_sku2'], ...batchParams });

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"crossSell","limit":20}],"siteId":"8uyt2m","product":"marnie-runner-2-7x10","blockedItems":["blocked_sku1","blocked_sku2"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles POST requests', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		//now consts try a post
		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},

			body: JSON.stringify({
				profiles: Array.from({ length: 100 }, (item, index) => {
					return {
						tag: index.toString(),
						limit: 20,
					};
				}),
				siteId: '8uyt2m',
				product: 'marnie-runner-2-7x10',
				lastViewed: [
					'marnie-runner-2-7x10',
					'ruby-runner-2-7x10',
					'abbie-runner-2-7x10',
					'riley-4x6',
					'joely-5x8',
					'helena-4x6',
					'kwame-4x6',
					'sadie-4x6',
					'candice-runner-2-7x10',
					'esmeray-4x6',
					'camilla-230x160',
					'candice-4x6',
					'sahara-4x6',
					'dayna-4x6',
					'moema-4x6',
				],
				filters: [
					{ field: 'color', type: '=', values: ['blue'] },
					{ field: 'price', type: '>=', values: [0] },
					{ field: 'price', type: '<=', values: [20] },
				],
			}),
		};

		const POSTRequestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend';

		const POSTRequestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		for (let i = 0; i < 100; i++) {
			api.batchRecommendations({
				tag: i.toString(),
				...batchParams,
				filters: [
					{
						type: 'value',
						field: 'color',
						value: 'blue',
					},
					{
						type: 'range',
						field: 'price',
						value: { low: 0, high: 20 },
					},
				],
				batched: true,
			});
		}

		//add delay for paramBatch.timeout
		await wait(250);

		expect(POSTRequestMock).toHaveBeenCalledWith(POSTRequestUrl, POSTParams);
		POSTRequestMock.mockReset();
	});
});
