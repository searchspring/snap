import 'whatwg-fetch';
import { addToCart } from './addToCart';
import { Product } from '@searchspring/snap-store-mobx';
import { MockClient } from '@searchspring/snap-shared';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '@searchspring/snap-controller';

const ORIGIN = 'http://localhost';
const ADD_ROUTE = '/remote/v1/cart/add';
const CART_ROUTE = '/cart.php';

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
let results: any;
let controller: any;
let errMock: any;

// @ts-ignore
const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ json: () => Promise.resolve([]), ok: true, status: 200 }));

const controllerServices: any = {
	client: new MockClient(globals, {}),
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

	it('requires product(s) to be passed', () => {
		// @ts-ignore
		addToCart();

		expect(fetchMock).not.toHaveBeenCalled();
		expect(errMock).toHaveBeenCalledWith('Error: no products to add');
	});

	it('adds data passed', () => {
		const item = results[0] as Product;
		addToCart([item]);

		const obj = {
			product_id: item.id,
			quantity: item.quantity,
			action: 'add',
		};
		const params = {
			body: JSON.stringify(obj),
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			method: 'POST',
		};

		expect(fetchMock).toHaveBeenCalledWith(ADD_ROUTE, params);

		fetchMock.mockClear();
	});

	it('can add multiple quantities', () => {
		const item = results[0] as Product;

		item.quantity = 4;

		addToCart([item]);

		const obj = {
			product_id: item.id,
			quantity: 4,
			action: 'add',
		};

		const params = {
			body: JSON.stringify(obj),
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			method: 'POST',
		};

		expect(fetchMock).toHaveBeenCalledWith(ADD_ROUTE, params);

		fetchMock.mockClear();

		item.quantity = 1;
	});

	it('can use alternate id column', () => {
		const config = {
			idFieldName: 'mappings.core.url',
		};

		const item = results[0] as Product;

		addToCart([item], config);

		const obj = {
			product_id: item.mappings.core?.url,
			quantity: item.quantity,
			action: 'add',
		};

		const params = {
			body: JSON.stringify(obj),
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			method: 'POST',
		};

		expect(fetchMock).toHaveBeenCalledWith(ADD_ROUTE, params);

		fetchMock.mockClear();
	});

	it('will redirect by default', async () => {
		const item = results[0] as Product;

		addToCart([item]);

		const obj = {
			product_id: item.id,
			quantity: item.quantity,
			action: 'add',
		};
		const params = {
			body: JSON.stringify(obj),
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			method: 'POST',
		};

		expect(fetchMock).toHaveBeenCalledWith(ADD_ROUTE, params);

		await wait(10);

		expect(window.location.href).toEqual(CART_ROUTE);

		fetchMock.mockClear();
	});

	it('will not redirect if config is false', async () => {
		const item = results[0] as Product;
		const config = {
			redirect: false,
		};

		addToCart([item], config);

		const obj = {
			product_id: item.id,
			quantity: item.quantity,
			action: 'add',
		};
		const params = {
			body: JSON.stringify(obj),
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			method: 'POST',
		};

		expect(fetchMock).toHaveBeenCalledWith(ADD_ROUTE, params);

		await wait(10);

		expect(window.location.href).toEqual(ORIGIN);

		fetchMock.mockClear();
	});

	it('can use a custom redirect', async () => {
		const config = {
			redirect: 'https://redirect.localhost',
		};

		const item = results[0] as Product;

		addToCart([item], config);

		const obj = {
			product_id: item.id,
			quantity: item.quantity,
			action: 'add',
		};
		const params = {
			body: JSON.stringify(obj),
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			method: 'POST',
		};

		expect(fetchMock).toHaveBeenCalledWith(ADD_ROUTE, params);

		await wait(10);

		expect(window.location.href).toEqual(config.redirect);

		fetchMock.mockClear();
	});

	it('can add multiple items', async () => {
		const items = results.slice(0, 3) as Product[];
		addToCart(items);

		for (let i = 0; i < items.length; i++) {
			const obj = {
				product_id: items[i].id,
				quantity: items[i].quantity,
				action: 'add',
			};
			const params = {
				body: JSON.stringify(obj),
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				method: 'POST',
			};

			await wait(10);

			expect(fetchMock).toHaveBeenCalledWith(ADD_ROUTE, params);
		}

		fetchMock.mockClear();
	});
});
