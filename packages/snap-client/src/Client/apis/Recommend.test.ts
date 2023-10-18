import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { RecommendAPI } from './Recommend';
import { MockData } from '@searchspring/snap-shared';

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

		expect(api?.getRecommendations).toBeDefined();

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

	it('can call getRecommendations', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			method: 'GET',
			headers: {},
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?siteId=8uyt2m&tags=dress';

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		await api.getRecommendations({
			siteId: '8uyt2m',
			tags: ['dress'],
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockClear();
	});

	it('can call postRecommendations', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			method: 'POST',
			body: '{"siteId":"88uyt2m","tags":["dress"]}',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const requestUrl = 'https://88uyt2m.a.searchspring.io/boost/88uyt2m/recommend';

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		await api.postRecommendations({
			siteId: '88uyt2m',
			tags: ['dress'],
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockClear();
	});

	it('can call batchRecommendations', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			method: 'GET',
			headers: {},
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=similar&limits=20&siteId=8uyt2m';

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		await api.batchRecommendations({
			siteId: '8uyt2m',
			tags: ['similar'],
		});

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);
		requestMock.mockReset();
	});

	const GETParams = {
		method: 'GET',
		headers: {},
	};

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
		product: ['marnie-runner-2-7x10'],
	};

	it('batchRecommendations batches as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		const GETRequestUrl =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=similar&tags=crossSell&limits=14&limits=10&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&lastViewed=helena-4x6&lastViewed=kwame-4x6&lastViewed=sadie-4x6&lastViewed=candice-runner-2-7x10&lastViewed=esmeray-4x6&lastViewed=camilla-230x160&lastViewed=candice-4x6&lastViewed=sahara-4x6&lastViewed=dayna-4x6&lastViewed=moema-4x6&product=marnie-runner-2-7x10';

		//product array changed to single product string
		// @ts-ignore
		api.batchRecommendations({
			tags: ['similar'],
			limits: 14,
			batched: true,
			...batchParams,
		});
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			limits: 10,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(GETRequestUrl, GETParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles multiple categories as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		const GETRequestUrl =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=similar&tags=crossSell&tags=crossSell&limits=14&limits=10&limits=10&categories=shirts&categories=pants&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&lastViewed=helena-4x6&lastViewed=kwame-4x6&lastViewed=sadie-4x6&lastViewed=candice-runner-2-7x10&lastViewed=esmeray-4x6&lastViewed=camilla-230x160&lastViewed=candice-4x6&lastViewed=sahara-4x6&lastViewed=dayna-4x6&lastViewed=moema-4x6&product=marnie-runner-2-7x10';

		//shirt category
		// @ts-ignore
		api.batchRecommendations({
			tags: ['similar'],
			categories: ['shirts'],
			limits: 14,
			batched: true,
			...batchParams,
		});
		//no category
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			limits: 10,
			batched: true,
			...batchParams,
		});
		//pants category
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			categories: ['pants'],
			limits: 10,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(GETRequestUrl, GETParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles order prop as expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//shirt category
		// @ts-ignore
		api.batchRecommendations({
			tags: ['similar'],
			categories: ['shirts'],
			limits: 14,
			order: 3,
			batched: true,
			...batchParams,
		});
		//no order
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			limits: 10,
			batched: true,
			...batchParams,
		});
		//no category
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			limits: 10,
			order: 2,
			batched: true,
			...batchParams,
		});
		//pants category
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			categories: ['pants'],
			limits: 10,
			order: 1,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);
		const reorderedGetURL =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=crossSell&tags=crossSell&tags=similar&tags=crossSell&limits=10&limits=10&limits=14&limits=10&categories=pants&categories=shirts&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&lastViewed=helena-4x6&lastViewed=kwame-4x6&lastViewed=sadie-4x6&lastViewed=candice-runner-2-7x10&lastViewed=esmeray-4x6&lastViewed=camilla-230x160&lastViewed=candice-4x6&lastViewed=sahara-4x6&lastViewed=dayna-4x6&lastViewed=moema-4x6&product=marnie-runner-2-7x10';
		expect(requestMock).toHaveBeenCalledWith(reorderedGetURL, GETParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles filters expected', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
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
		const reorderedGetURL =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=crossSell&limits=10&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&lastViewed=helena-4x6&lastViewed=kwame-4x6&lastViewed=sadie-4x6&lastViewed=candice-runner-2-7x10&lastViewed=esmeray-4x6&lastViewed=camilla-230x160&lastViewed=candice-4x6&lastViewed=sahara-4x6&lastViewed=dayna-4x6&lastViewed=moema-4x6&product=marnie-runner-2-7x10&filter.color=red';
		expect(requestMock).toHaveBeenCalledWith(reorderedGetURL, GETParams);
		requestMock.mockReset();
	});

	it('batchRecommendations resolves in right order with order prop', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));
		const response = mockData.file('recommend/results/8uyt2m/ordered.json');

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(response) } as Response));

		// @ts-ignore
		const promise1 = api.batchRecommendations({
			tags: ['similar'],
			categories: ['shirts'],
			limits: 10,
			order: 2,
			batched: true,
			...batchParams,
		});

		// @ts-ignore
		const promise2 = api.batchRecommendations({
			tags: ['crosssell'],
			categories: ['dress'],
			limits: 20,
			order: 1,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);
		const reorderedGetURL =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=crosssell&tags=similar&limits=20&limits=10&categories=dress&categories=shirts&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&lastViewed=helena-4x6&lastViewed=kwame-4x6&lastViewed=sadie-4x6&lastViewed=candice-runner-2-7x10&lastViewed=esmeray-4x6&lastViewed=camilla-230x160&lastViewed=candice-4x6&lastViewed=sahara-4x6&lastViewed=dayna-4x6&lastViewed=moema-4x6&product=marnie-runner-2-7x10';

		expect(requestMock).toHaveBeenCalledWith(reorderedGetURL, GETParams);

		const [response1, response2] = await Promise.all([promise1, promise2]);

		expect(response1[0].results.length).toBe(response[1].results.length);
		expect(response2[0].results.length).toBe(response[0].results.length);

		requestMock.mockReset();
	});

	it('batchRecommendations handles undefined limits', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		const requestURL =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=crossSell&limits=20&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&lastViewed=helena-4x6&lastViewed=kwame-4x6&lastViewed=sadie-4x6&lastViewed=candice-runner-2-7x10&lastViewed=esmeray-4x6&lastViewed=camilla-230x160&lastViewed=candice-4x6&lastViewed=sahara-4x6&lastViewed=dayna-4x6&lastViewed=moema-4x6&product=marnie-runner-2-7x10';

		//now consts try with no limits
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			...batchParams,
			limits: undefined,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(requestURL, GETParams);
		requestMock.mockReset();
	});

	it('batchRecommendations handles POST requests', async () => {
		const api = new RecommendAPI(new ApiConfiguration({}));

		//now consts try a post
		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tags: Array.from({ length: 100 }, (item, index) => index + ''),
				limits: Array(100).fill(20),
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
			}),
		};
		const POSTRequestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend';

		const POSTRequestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		for (let i = 0; i < 100; i++) {
			// @ts-ignore
			api.batchRecommendations({
				tags: [i.toString()],
				...batchParams,
				batched: true,
			});
		}

		//add delay for paramBatch.timeout
		await wait(250);

		expect(POSTRequestMock).toHaveBeenCalledWith(POSTRequestUrl, POSTParams);
		POSTRequestMock.mockReset();
	});
});
