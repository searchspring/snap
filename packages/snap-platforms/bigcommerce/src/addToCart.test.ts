import 'whatwg-fetch';
import { addToCart } from './addToCart';
import { MockClient } from '@searchspring/snap-shared';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '@searchspring/snap-controller';

import type { Product, SearchResultStore, SearchStoreConfig } from '@searchspring/snap-store-mobx';

const HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };
const MOCK_CART_ID = '123456789';
const ORIGIN = 'http://localhost';
const CART_ROUTE = '/api/storefront/carts';
const CART_EXISTS_ROUTE = `/api/storefront/carts/${MOCK_CART_ID}/items`;
const REDIRECT_ROUTE = '/cart.php';
const MOCK_ADDED_RESPONSE = { id: MOCK_CART_ID };

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services: any = {
	urlManager: urlManager,
};
let searchConfig = {
	id: 'search',
};

const globals = { siteId: '8uyt2m' };
const searchConfigDefault = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {},
};

let results: SearchResultStore;
let controller: SearchController;
let errMock: any;
let fetchMock: any;

const client = new MockClient(globals, {});
// TODO: need to use variant data from BigCommerce

const controllerServices: any = {
	client,
	store: new SearchStore(searchConfig, services),
	urlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(globals),
};

describe('addToCart', () => {
	beforeAll(async () => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, controllerServices);

		await controller.search();

		results = controller.store.results;

		errMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		// @ts-ignore
		fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url) => {
			let response: any = [];
			if (url == CART_ROUTE) {
				response = [{ id: MOCK_CART_ID }];
			} else if (url == CART_EXISTS_ROUTE) {
				response = MOCK_ADDED_RESPONSE;
			}

			return Promise.resolve({ json: () => Promise.resolve(response), ok: true, status: 200 });
		});
	});

	beforeEach(() => {
		global.window = Object.create(window);
		Object.defineProperty(window, 'location', {
			value: {
				origin: ORIGIN,
				href: ORIGIN,
			},
			writable: true,
		});
	});

	afterEach(() => {
		errMock.mockClear();
	});

	it('requires product(s) to be passed', () => {
		// @ts-ignore - adding with no params
		addToCart();

		expect(fetchMock).not.toHaveBeenCalled();
		expect(errMock).toHaveBeenCalledWith('bigcommerce/addToCart: No products to add!');
	});

	it('will log an error when it cannot find a custom id', async () => {
		const config = {
			idFieldName: 'mappings.dne.nope',
		};

		const item = results[0] as Product;

		await addToCart([item], config);

		expect(errMock).toHaveBeenCalledWith(`bigcommerce/addToCart: Could not find column in item data. Please verify 'idFieldName' in the config.`);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('will redirect by default', async () => {
		const item = results[0] as Product;

		await addToCart([item]);
		await wait(10);

		expect(window.location.href).toEqual(REDIRECT_ROUTE);

		fetchMock.mockClear();
	});

	it('will not redirect if config is false', async () => {
		const item = results[0] as Product;
		const config = {
			redirect: false,
		};

		await addToCart([item], config);
		await wait(10);

		expect(window.location.href).toEqual(ORIGIN);

		fetchMock.mockClear();
	});

	it('can use a custom redirect', async () => {
		const config = {
			redirect: 'https://redirect.localhost',
		};

		const item = results[0] as Product;

		await addToCart([item], config);
		await wait(10);

		expect(window.location.href).toEqual(config.redirect);

		fetchMock.mockClear();
	});

	it('will return the API response after adding', async () => {
		const item = results[0] as Product;

		const response = await addToCart([item]);

		expect(response).toStrictEqual(MOCK_ADDED_RESPONSE);

		fetchMock.mockClear();
	});

	describe('when a cart exists', () => {
		it('can add a single simple product', async () => {
			const item = results[0] as Product;

			await addToCart([item]);

			const getParams = {
				headers: HEADERS,
				method: 'GET',
			};

			expect(fetchMock).toHaveBeenCalledWith(CART_ROUTE, getParams);

			const postBody = {
				lineItems: [
					{
						product_id: item.id,
						quantity: item.quantity,
					},
				],
			};

			const postParams = {
				headers: HEADERS,
				method: 'POST',
				body: JSON.stringify(postBody),
			};

			expect(fetchMock).toHaveBeenLastCalledWith(CART_EXISTS_ROUTE, postParams);
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockClear();
		});

		it('can add a single product with options', async () => {
			client.mockData.updateConfig({ siteId: 'tfdz6e', search: 'variants' });
			const optionSearchConfig: SearchStoreConfig = {
				...searchConfig,
				settings: {
					redirects: {
						singleResult: false,
					},
					variants: {
						field: 'ss_variants',
					},
				},
			};
			const optionController = new SearchController(optionSearchConfig, controllerServices);

			await optionController.search();

			const results = optionController.store.results;

			const item = results[0] as Product;

			await addToCart([item]);

			const getParams = {
				headers: HEADERS,
				method: 'GET',
			};

			expect(fetchMock).toHaveBeenCalledWith(CART_ROUTE, getParams);

			const postBody = {
				lineItems: [
					{
						product_id: item.display.mappings.core?.uid,
						quantity: item.quantity,
						optionSelections: [
							{
								optionId: 570,
								optionValue: 2900,
							},
						],
					},
				],
			};

			const postParams = {
				headers: HEADERS,
				method: 'POST',
				body: JSON.stringify(postBody),
			};

			expect(fetchMock).toHaveBeenLastCalledWith(CART_EXISTS_ROUTE, postParams);
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockClear();
		});

		it('can add multiple items', async () => {
			const items = results.slice(0, 3) as Product[];
			items.forEach((item) => item.quantity++);

			await addToCart(items);

			const getParams = {
				headers: HEADERS,
				method: 'GET',
			};

			expect(fetchMock).toHaveBeenCalledWith(CART_ROUTE, getParams);

			const postBody = {
				lineItems: items.map((item) => ({
					product_id: item.id,
					quantity: item.quantity,
				})),
			};

			const postParams = {
				headers: HEADERS,
				method: 'POST',
				body: JSON.stringify(postBody),
			};

			expect(fetchMock).toHaveBeenLastCalledWith(CART_EXISTS_ROUTE, postParams);
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockClear();
		});

		it('can use alternate id column', async () => {
			const config = {
				idFieldName: 'mappings.core.sku',
			};

			const item = results[0] as Product;

			await addToCart([item], config);

			const getParams = {
				headers: HEADERS,
				method: 'GET',
			};

			expect(fetchMock).toHaveBeenCalledWith(CART_ROUTE, getParams);

			const postBody = {
				lineItems: [
					{
						product_id: item.mappings.core?.sku,
						quantity: item.quantity,
					},
				],
			};

			const postParams = {
				headers: HEADERS,
				method: 'POST',
				body: JSON.stringify(postBody),
			};

			expect(fetchMock).toHaveBeenLastCalledWith(CART_EXISTS_ROUTE, postParams);
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockClear();
		});
	});

	describe('when NO cart exists', () => {
		beforeAll(() => {
			// @ts-ignore
			fetchMock = jest.spyOn(global, 'fetch').mockImplementation((url) => {
				let response: any = [];
				if (url == CART_EXISTS_ROUTE) {
					response = MOCK_ADDED_RESPONSE;
				}

				return Promise.resolve({ json: () => Promise.resolve(response), ok: true, status: 200 });
			});
		});

		it('can add a single simple product', async () => {
			const item = results[0] as Product;

			await addToCart([item]);

			const getParams = {
				headers: HEADERS,
				method: 'GET',
			};

			expect(fetchMock).toHaveBeenCalledWith(CART_ROUTE, getParams);

			const postBody = {
				lineItems: [
					{
						product_id: item.id,
						quantity: item.quantity,
					},
				],
			};

			const postParams = {
				headers: HEADERS,
				method: 'POST',
				body: JSON.stringify(postBody),
			};

			expect(fetchMock).toHaveBeenLastCalledWith(CART_ROUTE, postParams);
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockClear();
		});

		it('can add a single product with options', async () => {
			client.mockData.updateConfig({ siteId: 'tfdz6e', search: 'variants' });
			const optionSearchConfig: SearchStoreConfig = {
				...searchConfig,
				settings: {
					redirects: {
						singleResult: false,
					},
					variants: {
						field: 'ss_variants',
					},
				},
			};
			const optionController = new SearchController(optionSearchConfig, controllerServices);

			await optionController.search();

			const results = optionController.store.results;

			const item = results[0] as Product;

			await addToCart([item]);

			const getParams = {
				headers: HEADERS,
				method: 'GET',
			};

			expect(fetchMock).toHaveBeenCalledWith(CART_ROUTE, getParams);

			const postBody = {
				lineItems: [
					{
						product_id: item.display.mappings.core?.uid,
						quantity: item.quantity,
						optionSelections: [
							{
								optionId: 570,
								optionValue: 2900,
							},
						],
					},
				],
			};

			const postParams = {
				headers: HEADERS,
				method: 'POST',
				body: JSON.stringify(postBody),
			};

			expect(fetchMock).toHaveBeenLastCalledWith(CART_ROUTE, postParams);
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockClear();
		});

		it('can add multiple items', async () => {
			const items = results.slice(0, 3) as Product[];
			await addToCart(items);

			const getParams = {
				headers: HEADERS,
				method: 'GET',
			};

			expect(fetchMock).toHaveBeenCalledWith(CART_ROUTE, getParams);

			const postBody = {
				lineItems: items.map((item) => ({
					product_id: item.id,
					quantity: item.quantity,
				})),
			};

			const postParams = {
				headers: HEADERS,
				method: 'POST',
				body: JSON.stringify(postBody),
			};

			expect(fetchMock).toHaveBeenLastCalledWith(CART_ROUTE, postParams);
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockClear();
		});
	});
});
