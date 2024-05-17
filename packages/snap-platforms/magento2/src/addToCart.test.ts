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
let formKey = 'omnomnom';
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
describe('Magento2', () => {
	beforeAll(async () => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, controllerServices);

		await controller.search();

		results = controller.store.results;

		errMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		Object.defineProperty(window.document, 'cookie', {
			writable: true,
			value: `form_key=${formKey}`,
		});
	});

	describe('addToCart', () => {
		const uenc = btoa(window.location.href);
		const root = `http://localhost/checkout/cart/add/uenc/${uenc}`;

		it('requires data to exist on the dom', () => {
			// @ts-ignore
			addToCart();

			expect(fetchMock).not.toHaveBeenCalled();
			expect(errMock).toHaveBeenCalledWith('Error: no products to add');
		});

		it('adds data passed', () => {
			const item = results[0];
			addToCart([item]);

			expect(fetchMock).toHaveBeenCalled();

			const body = {
				product: item.mappings.core?.uid,
				form_key: formKey,
				uenc: uenc,
				qty: '1',
			};

			expect(fetchMock).toHaveBeenCalledWith(
				`${root}/product/${item.id}/addon_product/1/`,
				expect.objectContaining({ method: 'POST', body: expect.any(FormData) })
			);

			// @ts-ignore
			const fetchedFormData = Array.from(fetchMock.mock.calls[0][1].body.entries()).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {});

			expect(fetchedFormData).toMatchObject(body);

			fetchMock.mockClear();
		});

		it('can add multiple quantities', () => {
			const item = results[0];

			item.quantity = 4;

			addToCart([item]);

			expect(fetchMock).toHaveBeenCalled();

			const body = {
				product: item.mappings.core?.uid,
				form_key: formKey,
				uenc: uenc,
				qty: '4',
			};

			expect(fetchMock).toHaveBeenCalledWith(
				`${root}/product/${item.id}/addon_product/1/`,
				expect.objectContaining({ method: 'POST', body: expect.any(FormData) })
			);

			// @ts-ignore
			const fetchedFormData = Array.from(fetchMock.mock.calls[0][1].body.entries()).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {});

			expect(fetchedFormData).toMatchObject(body);

			fetchMock.mockClear();

			item.quantity = 1;
		});

		it('can use alternate id column', () => {
			const config = {
				idFieldName: 'mappings.core.url',
			};

			const item = results[0];

			addToCart([item], config);

			const body = {
				product: item.mappings.core?.url,
				form_key: formKey,
				uenc: uenc,
				qty: '1',
			};

			expect(fetchMock).toHaveBeenCalledWith(
				`${root}/product/${item.mappings.core?.url}/addon_product/1/`,
				expect.objectContaining({ method: 'POST', body: expect.any(FormData) })
			);

			// @ts-ignore
			const fetchedFormData = Array.from(fetchMock.mock.calls[0][1].body.entries()).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {});

			expect(fetchedFormData).toMatchObject(body);

			fetchMock.mockClear();
		});

		it('can pass a callback', async () => {
			const cb = jest.fn();
			const config = {
				callback: cb,
			};

			const item = results[0];

			addToCart([item], config);

			const body = {
				product: item.mappings.core?.uid,
				form_key: formKey,
				uenc: uenc,
				qty: '1',
			};

			expect(fetchMock).toHaveBeenCalledWith(
				`${root}/product/${item.id}/addon_product/1/`,
				expect.objectContaining({ method: 'POST', body: expect.any(FormData) })
			);

			// @ts-ignore
			const fetchedFormData = Array.from(fetchMock.mock.calls[0][1].body.entries()).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {});

			expect(fetchedFormData).toMatchObject(body);

			await wait(300);

			expect(cb).toHaveBeenCalled();

			fetchMock.mockClear();
		});

		it('can add multiple items', async () => {
			const items = results.slice(0, 3) as Product[];

			addToCart(items);

			for (let i = 0; i < items.length; i++) {
				const obj = {
					product: items[i].mappings.core?.uid,
					form_key: formKey,
					uenc: uenc,
					qty: '1',
				};

				await wait(10);

				expect(fetchMock).toHaveBeenCalledWith(
					`${root}/product/${items[i].id}/addon_product/1/`,
					expect.objectContaining({ method: 'POST', body: expect.any(FormData) })
				);

				// @ts-ignore
				const fetchedFormData = Array.from(fetchMock.mock.calls[i][1].body.entries()).reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {});

				expect(fetchedFormData).toMatchObject(obj);
			}

			fetchMock.mockClear();
		});
	});
});
