import 'whatwg-fetch';
import { ApiConfiguration, ApiConfigurationParameters } from './Abstract';
import { RecommendAPI } from './Recommend';
import { MockData } from '@searchspring/snap-shared';

import type { RecommendPostRequestModel } from '../../types';

const mockData = new MockData();

const wait = (time?: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

const apiConfig: ApiConfigurationParameters = { cache: { enabled: false } };

describe('Recommend Api', () => {
	it('has expected default functions', () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		// @ts-ignore - accessing private property
		expect(api?.batches).toBeDefined();

		expect(api?.getProfile).toBeDefined();

		expect(api?.batchRecommendations).toBeDefined();

		expect(api?.postRecommendations).toBeDefined();
	});

	it('can call getProfile', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

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
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const params = {
			method: 'POST',
			body: '{"siteId":"8uyt2m","profiles":[{"tag":"dress"}]}',
			headers: {
				'Content-Type': 'text/plain',
			},
		};

		const requestParameters: RecommendPostRequestModel = {
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
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const params = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: `{"profiles":[{"tag":"similar"}],"siteId":"8uyt2m"}`,
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
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({
			tag: 'similar',
			limit: 14,
			batched: true,
			...batchParams,
		});

		api.batchRecommendations({
			tag: 'crossSell',
			limit: 10,
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
			body: '{"profiles":[{"tag":"similar","limit":14},{"tag":"crossSell","limit":10}],"siteId":"8uyt2m","products":["marnie-runner-2-7x10"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles multiple categories as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//shirt category
		api.batchRecommendations({
			tag: 'similar',
			categories: ['shirts'],
			limit: 14,
			batched: true,
			...batchParams,
		});
		//no category
		api.batchRecommendations({
			tag: 'crossSell',
			limit: 10,
			batched: true,
			...batchParams,
		});
		//pants category
		api.batchRecommendations({
			tag: 'crossSell',
			categories: ['pants'],
			limit: 10,
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
			body: '{"profiles":[{"tag":"similar","categories":["shirts"],"limit":14},{"tag":"crossSell","limit":10},{"tag":"crossSell","categories":["pants"],"limit":10}],"siteId":"8uyt2m","products":["marnie-runner-2-7x10"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles multiple brands as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//shirt category
		api.batchRecommendations({
			tag: 'similar',
			brands: ['shirts'],
			limit: 14,
			batched: true,
			...batchParams,
		});
		//pants category
		api.batchRecommendations({
			tag: 'crossSell',
			brands: ['pants', 'pants2'],
			limit: 10,
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
			body: '{"profiles":[{"tag":"similar","brands":["shirts"],"limit":14},{"tag":"crossSell","brands":["pants","pants2"],"limit":10}],"siteId":"8uyt2m","products":["marnie-runner-2-7x10"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations uses parameters regardless of order specified in requests', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({
			tag: 'similar',
			products: ['sku1'],
			batched: true,
			siteId: '8uyt2m',
			limit: 20,
		});

		api.batchRecommendations({
			tag: 'crossSell',
			batched: true,
			siteId: '8uyt2m',
		});

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"similar","limit":20},{"tag":"crossSell"}],"siteId":"8uyt2m","products":["sku1"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations unbatches properly', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({
			tag: 'similar',
			products: ['sku1'],
			batched: false,
			siteId: '8uyt2m',
			limit: 20,
		});

		api.batchRecommendations({
			tag: 'crossSell',
			batched: true,
			siteId: '8uyt2m',
		});

		api.batchRecommendations({
			tag: 'static',
			batched: true,
			siteId: '8uyt2m',
		});

		//add delay for paramBatch.timeout
		await wait(250);

		const firstBatchPOSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"similar","limit":20}],"siteId":"8uyt2m","products":["sku1"]}',
		};
		const secondBatchPOSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"crossSell"},{"tag":"static"}],"siteId":"8uyt2m"}',
		};

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(requestMock).toHaveBeenNthCalledWith(1, 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend', firstBatchPOSTParams);
		expect(requestMock).toHaveBeenNthCalledWith(2, 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend', secondBatchPOSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations can be passed a profile', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({
			tag: 'similar',
			siteId: '8uyt2m',
			products: ['sku1'],
			batched: true,
			profile: {
				limit: 20,
			},
		});

		api.batchRecommendations({
			tag: 'crossSell',
			siteId: '8uyt2m',
			batched: true,
			profile: {
				limit: 10,
			},
		});

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"similar","limit":20},{"tag":"crossSell","limit":10}],"siteId":"8uyt2m","products":["sku1"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations unbatches when different siteIds are provided', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({
			tag: 'similar',
			products: ['sku1'],
			batched: true,
			siteId: '8uyt2m',
			profile: {
				limit: 20,
			},
		});

		api.batchRecommendations({
			tag: 'crossSell',
			batched: true,
			siteId: '8uyt2m',
			profile: {
				siteId: '123abc',
				limit: 5,
			},
		});

		//add delay for paramBatch.timeout
		await wait(250);

		const POSTParams8uyt2m = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"similar","limit":20}],"siteId":"8uyt2m","products":["sku1"]}',
		};
		const POSTParams123abc = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"crossSell","limit":5}],"siteId":"123abc"}',
		};

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(requestMock).toHaveBeenNthCalledWith(1, 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend', POSTParams8uyt2m);
		expect(requestMock).toHaveBeenNthCalledWith(2, 'https://123abc.a.searchspring.io/boost/123abc/recommend', POSTParams123abc);
		requestMock.mockReset();
	});

	it('batchRecommendations handles order prop as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//shirt category
		api.batchRecommendations({
			tag: 'similar',
			categories: ['shirts'],
			limit: 14,
			order: 3,
			batched: true,
			...batchParams,
		});
		//no order
		api.batchRecommendations({
			tag: 'other',
			limit: 10,
			batched: true,
			...batchParams,
		});
		//no category
		api.batchRecommendations({
			tag: 'another',
			limit: 10,
			order: 2,
			batched: true,
			...batchParams,
		});
		//pants category
		api.batchRecommendations({
			tag: 'andanother',
			categories: ['pants'],
			limit: 10,
			order: 1,
			batched: true,
			...batchParams,
		});

		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},
			body: '{"profiles":[{"tag":"andanother","categories":["pants"],"limit":10},{"tag":"another","limit":10},{"tag":"similar","categories":["shirts"],"limit":14},{"tag":"other","limit":10}],"siteId":"8uyt2m","products":["marnie-runner-2-7x10"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations resolves in right order with order prop', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));
		const response = mockData.file('recommend/results/8uyt2m/ordered.json');

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(response) } as Response));

		const promise1 = api.batchRecommendations({
			tag: 'similar',
			categories: ['shirts'],
			limit: 10,
			order: 2,
			batched: true,
			...batchParams,
		});

		const promise2 = api.batchRecommendations({
			tag: 'crosssell',
			categories: ['dress'],
			limit: 20,
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
			body: '{"profiles":[{"tag":"crosssell","categories":["dress"],"limit":20},{"tag":"similar","categories":["shirts"],"limit":10}],"siteId":"8uyt2m","products":["marnie-runner-2-7x10"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);

		const [response1, response2] = await Promise.all([promise1, promise2]);

		expect(response1.results.length).toBe(response[1].results.length);
		expect(response2.results.length).toBe(response[0].results.length);

		requestMock.mockReset();
	});

	it('batchRecommendations resolves in right order with order prop when order is in profile', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));
		const response = mockData.file('recommend/results/8uyt2m/ordered.json');

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(response) } as Response));

		const promise1 = api.batchRecommendations({
			tag: 'second',
			profile: {
				order: 2,
				categories: ['shirts'],
				limit: 10,
			},
			batched: true,
			...batchParams,
		});

		const promise2 = api.batchRecommendations({
			tag: 'first',
			profile: {
				order: 1,
				categories: ['dress'],
				limit: 20,
			},
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
			body: '{"profiles":[{"tag":"first","categories":["dress"],"limit":20},{"tag":"second","categories":["shirts"],"limit":10}],"siteId":"8uyt2m","products":["marnie-runner-2-7x10"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);

		const [response1, response2] = await Promise.all([promise1, promise2]);

		expect(response1.results.length).toBe(response[1].results.length);
		expect(response2.results.length).toBe(response[0].results.length);

		requestMock.mockReset();
	});

	it('batchRecommendations handles filters expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		api.batchRecommendations({
			tag: 'crossSell',
			limit: 10,
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
			body: '{"profiles":[{"tag":"crossSell","limit":10}],"siteId":"8uyt2m","products":["marnie-runner-2-7x10"],"filters":[{"field":"color","type":"=","values":["red"]}],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations will combine `product` and `products` params into `products` when used together', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

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
			body: '{"profiles":[{"tag":"crossSell"}],"siteId":"8uyt2m","products":["some_sku","some_sku2","marnie-runner-2-7x10"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations will utilize the `blockedItems` parameter when provided', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

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
			body: '{"profiles":[{"tag":"crossSell"}],"siteId":"8uyt2m","products":["marnie-runner-2-7x10"],"blockedItems":["blocked_sku1","blocked_sku2"],"lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8","helena-4x6","kwame-4x6","sadie-4x6","candice-runner-2-7x10","esmeray-4x6","camilla-230x160","candice-4x6","sahara-4x6","dayna-4x6","moema-4x6"]}',
		};

		expect(requestMock).toHaveBeenCalledWith(RequestUrl, POSTParams);
		requestMock.mockReset();
	});

	it('batchRecommendations deduplicates certain global request parameters', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

		//now consts try a post
		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
			},

			body: JSON.stringify({
				profiles: [
					{ tag: 'profile1' },
					{ tag: 'profile2', filters: [{ field: 'size', type: '=', values: ['small'] }] },
					{ tag: 'profile3', blockedItems: ['sku3p'] },
				],
				siteId: '8uyt2m',
				products: ['product1', 'product2', 'product3', 'product4'],
				blockedItems: ['sku1', 'sku3', 'sku4', 'sku2'],
				filters: [
					{ field: 'color', type: '=', values: ['blue'] },
					{ field: 'price', type: '>=', values: [0] },
					{ field: 'price', type: '<=', values: [20] },
					{ field: 'price', type: '<=', values: [40] },
					{ field: 'color', type: '=', values: ['green'] },
				],
			}),
		};

		const POSTRequestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend';

		const POSTRequestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		// profile 1
		api.batchRecommendations({
			tag: 'profile1',
			siteId: '8uyt2m',
			products: ['product1'],
			blockedItems: ['sku1'],
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

		// profile 2
		api.batchRecommendations({
			tag: 'profile2',
			profile: {
				filters: [
					{
						type: 'value',
						field: 'size',
						value: 'small',
					},
				],
			},
			siteId: '8uyt2m',
			products: ['product2', 'product3'],
			blockedItems: ['sku3', 'sku4'],
			filters: [
				{
					type: 'range',
					field: 'price',
					value: { low: 0, high: 40 },
				},
			],
			batched: true,
		});

		// profile 3
		api.batchRecommendations({
			tag: 'profile3',
			profile: {
				blockedItems: ['sku3p'],
			},
			siteId: '8uyt2m',
			product: 'product4',
			blockedItems: ['sku2', 'sku3'],
			filters: [
				{
					type: 'value',
					field: 'color',
					value: 'green',
				},
			],
			batched: true,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		expect(POSTRequestMock).toHaveBeenCalledWith(POSTRequestUrl, POSTParams);
		POSTRequestMock.mockReset();
	});

	it('batchRecommendations handles POST requests', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

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
					};
				}),
				siteId: '8uyt2m',
				products: ['marnie-runner-2-7x10'],
				blockedItems: ['sku1', 'sku2', 'sku3'],
				filters: [
					{ field: 'color', type: '=', values: ['blue'] },
					{ field: 'price', type: '>=', values: [0] },
					{ field: 'price', type: '<=', values: [20] },
				],
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
				blockedItems: ['sku1', 'sku2', 'sku3'],
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

	it('batchRecommendations handles POST requests with profile specific request parameters', async () => {
		const api = new RecommendAPI(new ApiConfiguration(apiConfig));

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
						blockedItems: ['skuBlocked', `sku${index}`],
						filters: [{ field: 'color', type: '=', values: ['red'] }],
					};
				}),
				siteId: '8uyt2m',
				products: ['marnie-runner-2-7x10'],
				blockedItems: ['sku1', 'sku2', 'sku3'],
				filters: [
					{ field: 'color', type: '=', values: ['blue'] },
					{ field: 'price', type: '>=', values: [0] },
					{ field: 'price', type: '<=', values: [20] },
				],
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
			}),
		};

		const POSTRequestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend';

		const POSTRequestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		for (let i = 0; i < 100; i++) {
			api.batchRecommendations({
				tag: i.toString(),
				profile: {
					blockedItems: ['skuBlocked', `sku${i}`],
					filters: [
						{
							type: 'value',
							field: 'color',
							value: 'red',
						},
					],
				},
				...batchParams,
				blockedItems: ['sku1', 'sku2', 'sku3'],
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
