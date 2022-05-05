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

		const requestUrl = 'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=similar&limits=undefined&siteId=8uyt2m';

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

	it('batchRecommendations trims and batches as expected', async () => {
		let api = new RecommendAPI(new ApiConfiguration({}));

		const GETParams = {
			method: 'GET',
			headers: {},
		};

		const batchParams = {
			siteId: '8uyt2m',
			batched: true,
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
			limits: 20,
			product: ['marnie-runner-2-7x10'],
		};

		const GETRequestUrl =
			'https://8uyt2m.a.searchspring.io/boost/8uyt2m/recommend?tags=similar&tags=crossSell&limits=20&limits=20&siteId=8uyt2m&lastViewed=marnie-runner-2-7x10&lastViewed=ruby-runner-2-7x10&lastViewed=abbie-runner-2-7x10&lastViewed=riley-4x6&lastViewed=joely-5x8&product=marnie-runner-2-7x10';

		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.recommend()) } as Response));

		//15 lastViewed trimmed to first 5, & product array changed to single product string
		// @ts-ignore
		api.batchRecommendations({
			tags: ['similar'],
			...batchParams,
		});
		// @ts-ignore
		api.batchRecommendations({
			tags: ['crossSell'],
			...batchParams,
		});

		//add delay for paramBatch.timeout
		await wait(250);

		expect(requestMock).toHaveBeenCalledWith(GETRequestUrl, GETParams);
		requestMock.mockReset();

		//now lets try a post
		const POSTParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: '{"tags":["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99"],"limits":[20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],"siteId":"8uyt2m","lastViewed":["marnie-runner-2-7x10","ruby-runner-2-7x10","abbie-runner-2-7x10","riley-4x6","joely-5x8"],"product":"marnie-runner-2-7x10"}',
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
