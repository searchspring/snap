import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { RecommendAPI } from './Recommend';
import { MockData } from '@searchspring/snap-shared';

const mockData = new MockData();

const wait = (time = undefined) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('Recommend Api', () => {
	it('has expected default functions', () => {
		let api;

		expect(() => {
			api = new RecommendAPI(new ApiConfiguration({}));
		}).not.toThrow();

		expect(api.batches).toBeDefined();

		expect(api.getProfile).toBeDefined();

		expect(api.batchRecommendations).toBeDefined();

		expect(api.getRecommendations).toBeDefined();

		expect(api.postRecommendations).toBeDefined();
	});

	it('can call getProfile', async () => {
		let api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			body: undefined,
			headers: {},
			method: 'GET',
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/api/personalized-recommendations/profile.json?siteId=8uyt2m&tag=dress';

		let requestMock = jest
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
		let api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			method: 'GET',
			headers: {},
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?siteId=8uyt2m&tags=dress';

		let requestMock = jest
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
		let api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			method: 'POST',
			body: '{"siteId":"88uyt2m","tags":["dress"]}',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const requestUrl = 'https://88uyt2m.a.searchspring.io/boost/88uyt2m/recommend';

		let requestMock = jest
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
		let api = new RecommendAPI(new ApiConfiguration({}));

		const params = {
			method: 'GET',
			headers: {},
		};

		const requestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=similar&limits=20&siteId=8uyt2m';

		let requestMock = jest
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
		let api = new RecommendAPI(new ApiConfiguration({}));

		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		const GETRequestUrl =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=similar&tags=crossSell&limits=20&limits=20&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&lastViewed=helena-4x6&lastViewed=kwame-4x6&lastViewed=sadie-4x6&lastViewed=candice-runner-2-7x10&lastViewed=esmeray-4x6&lastViewed=camilla-230x160&lastViewed=candice-4x6&lastViewed=sahara-4x6&lastViewed=dayna-4x6&lastViewed=moema-4x6&product=marnie-runner-2-7x10';

		//product array changed to single product string
		// @ts-ignore
		api.batchRecommendations({
			tags: ['similar'],
			limits: 20,
			batched: true,
			...batchParams,
		});
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			limits: 20,
			batched: true,
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(GETRequestUrl, GETParams);
		requestMock.mockReset();
	});
	it('batchRecommendations handles undefined limits', async () => {
		let api = new RecommendAPI(new ApiConfiguration({}));

		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		const requestURL =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=crossSell&limits=20&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&lastViewed=helena-4x6&lastViewed=kwame-4x6&lastViewed=sadie-4x6&lastViewed=candice-runner-2-7x10&lastViewed=esmeray-4x6&lastViewed=camilla-230x160&lastViewed=candice-4x6&lastViewed=sahara-4x6&lastViewed=dayna-4x6&lastViewed=moema-4x6&product=marnie-runner-2-7x10';

		//now lets try with no limits
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
		let api = new RecommendAPI(new ApiConfiguration({}));

		//now lets try a post
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

		let POSTRequestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

		for (let i = 0; i < 100; i++) {
			// @ts-ignore
			api.batchRecommendations({
				tags: [i.toString()],
				...batchParams,
			});
		}

		//add delay for paramBatch.timeout
		await wait(250);

		expect(POSTRequestMock).toHaveBeenCalledWith(POSTRequestUrl, POSTParams);
		POSTRequestMock.mockReset();
	});
});
