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

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
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

describe('Shopify AddToCart', () => {
	beforeAll(async () => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.search();

		results = controller.store.results;

		errMock = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	// @ts-ignore
	const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({ json: () => Promise.resolve([]), ok: true, status: 200 }));

	describe('requires shopify to exist on the dom', () => {
		it('requires shopify to exist on the dom', () => {
			//@ts-ignore
			addToCart();
			expect(fetchMock).not.toHaveBeenCalled();
			expect(errMock).toHaveBeenCalledWith('Error: Shopify Object not detected');
		});
	});

	describe('has shopify in the dom', () => {
		const root = 'root/';
		beforeAll(() => {
			//@ts-ignore
			global.Shopify = {
				routes: {
					root: root,
				},
			};
		});

		it('requires data to be passed', () => {
			//@ts-ignore
			addToCart();
			expect(fetchMock).not.toHaveBeenCalled();
			expect(errMock).toHaveBeenCalledWith('Error: no products to add');
		});

		it('adds data passed', () => {
			const item = results[0] as Product;

			addToCart([item]);

			expect(fetchMock).toHaveBeenCalled();
			fetchMock.mockClear();
		});

		it('can add multiple quantities', () => {
			const config = {
				idFieldName: 'id',
			};

			const item = results[0] as Product;

			item.quantity = 4;

			addToCart([item], config);

			const obj = {
				id: +item.id,
				quantity: 4,
			};

			const params = { body: JSON.stringify({ items: [obj] }), headers: { 'Content-Type': 'application/json' }, method: 'POST' };

			const requestUrl = `${root}cart/add.js`;

			expect(fetchMock).toHaveBeenCalledWith(requestUrl, params);

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
				id: item.mappings.core?.url,
				quantity: item.quantity,
			};

			const params = { body: JSON.stringify({ items: [obj] }), headers: { 'Content-Type': 'application/json' }, method: 'POST' };

			const requestUrl = `${root}cart/add.js`;

			expect(fetchMock).toHaveBeenCalledWith(requestUrl, params);

			fetchMock.mockClear();
		});

		it('can pass a callback', async () => {
			const cb = jest.fn();
			const config = {
				idFieldName: 'id',
				callback: cb,
			};

			const item = results[0] as Product;

			addToCart([item], config);

			const obj = {
				id: +item.id,
				quantity: item.quantity,
			};

			const params = { body: JSON.stringify({ items: [obj] }), headers: { 'Content-Type': 'application/json' }, method: 'POST' };

			const requestUrl = `${root}cart/add.js`;

			expect(fetchMock).toHaveBeenCalledWith(requestUrl, params);

			await wait(10);

			expect(cb).toHaveBeenCalled();

			fetchMock.mockClear();
		});

		it('can add multiple items', async () => {
			const config = {
				idFieldName: 'id',
			};

			const items = results.slice(0, 3) as Product[];
			addToCart(items, config);

			const itemsArray: any = [];
			for (let i = 0; i < items.length; i++) {
				const obj = {
					id: +items[i].id,
					quantity: items[i].quantity,
				};

				itemsArray.push(obj);
			}

			const params = { body: JSON.stringify({ items: itemsArray }), headers: { 'Content-Type': 'application/json' }, method: 'POST' };

			const requestUrl = `${root}cart/add.js`;

			expect(fetchMock).toHaveBeenCalledWith(requestUrl, params);

			fetchMock.mockClear();
		});
	});
});
