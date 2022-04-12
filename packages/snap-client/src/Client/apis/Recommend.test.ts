import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { RecommendAPI } from './Recommend';

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
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as unknown as Response));

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
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as unknown as Response));

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
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as unknown as Response));

		await api.postRecommendations({
			siteId: '88uyt2m',
			tags: ['dress'],
		});

		expect(requestMock).toHaveBeenCalledWith(requestUrl, params);

		requestMock.mockClear();
	});

	it('can call batchRecommendations', async () => {
		let api = new RecommendAPI(new ApiConfiguration({}));
		const response = [
			{
				results: [
					{
						id: '182022',
						mappings: {
							core: {
								uid: '182022',
								name: 'Stripe Out Blue Off-The-Shoulder Dress',
								sku: 'C-AD-I2-69PST',
								msrp: 50,
								price: 48,
								thumbnailImageUrl:
									'https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_thumb_med/2950_copyright_reddressboutique_2017__thumb_med.jpg',
								url: '/product/C-AD-I2-69PST',
								rating: '5',
								brand: 'Adrienne',
								popularity: 1135,
								imageUrl:
									'https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/2950_copyright_reddressboutique_2017__large.jpg',
								ratingCount: 1111,
							},
						},
						attributes: {},
					},
				],
				profile: {
					tag: 'similar',
				},
			},
		];

		const params = {
			method: 'GET',
			path: '/boost/8uyt2m/recommend',
			headers: {},
			query: {
				limits: [undefined],
				siteId: '8uyt2m',
				tags: ['similar'],
			},
		};

		const requestUrl = '/boost/8uyt2m/recommend{"tags":["similar"],"limits":[null],"siteId":"8uyt2m"}';

		let requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(response) } as unknown as Response));

		await api.batchRecommendations({
			siteId: '8uyt2m',
			tags: ['similar'],
		});

		//add delay for paramBatch.timeout
		setTimeout(() => {
			expect(requestMock).toHaveBeenCalledWith(params, requestUrl);

			requestMock.mockReset();
		}, 400);
	});
});
