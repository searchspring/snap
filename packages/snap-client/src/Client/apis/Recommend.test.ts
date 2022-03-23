import 'whatwg-fetch';
import { ApiConfiguration } from './Abstract';
import { RecommendAPI } from './Recommend';

describe('Legacy Api', () => {
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

	it('can call getProfile', () => {
		let api = new RecommendAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			headers: {},
			method: 'GET',
			path: '/api/personalized-recommendations/profile.json',
			query: {
				siteId: '8uyt2m',
				tag: 'dress',
			},
		};

		const cacheKey = '/api/personalized-recommendations/profile.json{"siteId":"8uyt2m","tag":"dress"}';

		api.getProfile({
			siteId: '8uyt2m',
			tag: 'dress',
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call getRecommendations', () => {
		let api = new RecommendAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			method: 'GET',
			path: '/boost/8uyt2m/recommend',
			headers: {},
			query: {
				siteId: '8uyt2m',
				tags: ['dress'],
			},
		};

		const cacheKey = '/boost/8uyt2m/recommend{"siteId":"8uyt2m","tags":["dress"]}';

		api.getRecommendations({
			siteId: '8uyt2m',
			tags: ['dress'],
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
	});

	it('can call postRecommendations', () => {
		let api = new RecommendAPI(new ApiConfiguration({}));
		const requestMock = jest.spyOn(global.window, 'fetch');

		//@ts-ignore
		api.request = requestMock;
		const params = {
			method: 'POST',
			path: '/boost/8uyt2m/recommend',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				siteId: '8uyt2m',
				tags: ['dress'],
			},
		};

		const cacheKey = '/boost/8uyt2m/recommend{"siteId":"8uyt2m","tags":["dress"]}';

		api.postRecommendations({
			siteId: '8uyt2m',
			tags: ['dress'],
		});

		expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

		requestMock.mockReset();
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

		const requestMock = jest.spyOn(global.window, 'fetch').mockResolvedValue(response as unknown as Response);

		//@ts-ignore
		api.request = requestMock;
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

		const cacheKey = '/boost/8uyt2m/recommend{"tags":["similar"],"limits":[null],"siteId":"8uyt2m"}';

		expect(
			api.batchRecommendations({
				siteId: '8uyt2m',
				tags: ['similar'],
			})
		).resolves.not.toThrow();

		//add delay for paramBatch.timeout
		setTimeout(() => {
			expect(requestMock).toHaveBeenCalledWith(params, cacheKey);

			requestMock.mockReset();
		}, 400);
	});
});
