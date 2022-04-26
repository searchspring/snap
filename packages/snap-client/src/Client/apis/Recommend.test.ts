import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { RecommendAPI } from './Recommend';
import { MockData } from '@searchspring/snap-shared';

const mockData = new MockData();

const wait = (time: undefined | number = undefined) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('Recommend Api', () => {
	it('has expected default functions', () => {
		let api = new RecommendAPI(new ApiConfiguration({}));

		expect(api?.batches).toBeDefined();

		expect(api?.getProfile).toBeDefined();

		expect(api?.batchRecommendations).toBeDefined();

		expect(api?.getRecommendations).toBeDefined();

		expect(api?.postRecommendations).toBeDefined();
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
});
