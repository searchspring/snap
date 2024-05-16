import { MockData } from '@searchspring/snap-shared';
import { CartStore } from './CartStore';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { Product, SearchResultStore } from '../Search/Stores/SearchResultStore';
import { waitFor } from '@testing-library/preact';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const _mockData = new MockData();

const searchConfig = {
	id: 'search',
};

const mockData = _mockData.recommend();
const results = new SearchResultStore(searchConfig, services, _mockData.meta(), mockData.results);

describe('CartStore store', () => {
	it('creates a cart store', () => {
		const cartStore = new CartStore();

		expect(cartStore).toBeDefined();
		expect(cartStore.items).toStrictEqual([]);
		expect(cartStore.count).toStrictEqual(0);
		expect(cartStore.price).toStrictEqual(0);
		expect(cartStore.msrp).toStrictEqual(0);
		expect(cartStore.addItems).toBeDefined();
		expect(cartStore.removeItems).toBeDefined();
		expect(cartStore.reset).toBeDefined();
	});

	it('can add and remove items and update expected fields', () => {
		const cartStore = new CartStore();

		expect(cartStore.items).toStrictEqual([]);
		expect(cartStore.count).toStrictEqual(0);
		expect(cartStore.price).toStrictEqual(0);
		expect(cartStore.msrp).toStrictEqual(0);
		const result = results[0] as Product;
		cartStore.addItems([result]);

		expect(cartStore.items).toHaveLength(1);
		expect(cartStore.count).toStrictEqual(1);
		expect(cartStore.price).toStrictEqual(result.mappings.core?.price);
		expect(cartStore.msrp).toStrictEqual(result.mappings.core?.msrp);

		cartStore.removeItems([result]);

		expect(cartStore.items).toStrictEqual([]);
		expect(cartStore.count).toStrictEqual(0);
		expect(cartStore.price).toStrictEqual(0);
		expect(cartStore.msrp).toStrictEqual(0);
	});

	it('can add multiple items at once and update expected fields & use reset', () => {
		const cartStore = new CartStore();

		cartStore.addItems([results[0] as Product, results[1] as Product, results[2] as Product, results[3] as Product]);

		expect(cartStore.items).toHaveLength(4);
		expect(cartStore.count).toStrictEqual(4);
		expect(cartStore.price).toStrictEqual(106.5);
		expect(cartStore.msrp).toStrictEqual(150);

		cartStore.reset();

		expect(cartStore.items).toStrictEqual([]);
		expect(cartStore.count).toStrictEqual(0);
		expect(cartStore.price).toStrictEqual(0);
		expect(cartStore.msrp).toStrictEqual(0);
	});

	it('can adjust count and price when items quantities update', () => {
		const cartStore = new CartStore();

		const result = results[0] as Product;
		cartStore.addItems([result]);

		expect(cartStore.items).toHaveLength(1);
		expect(cartStore.count).toStrictEqual(1);
		expect(cartStore.price).toStrictEqual(result.mappings.core?.price);
		expect(cartStore.msrp).toStrictEqual(result.mappings.core?.msrp);

		result.quantity = 3;

		expect(cartStore.items).toHaveLength(1);
		expect(cartStore.count).toStrictEqual(3);
		expect(cartStore.price).toStrictEqual(result.mappings.core?.price ? result.mappings.core?.price * 3 : 0);
		expect(cartStore.msrp).toStrictEqual(result.mappings.core?.msrp ? result.mappings.core?.msrp * 3 : 0);
	});

	it('can use the eventmanager events', async () => {
		const cartStore = new CartStore();

		let emptiedCount = 0;
		let resetCount = 0;
		let removeCount = 0;
		let addCount = 0;

		cartStore.on('emptied', () => {
			emptiedCount = emptiedCount + 1;
		});

		cartStore.on('reset', () => {
			resetCount = resetCount + 1;
		});
		cartStore.on('addItems', () => {
			addCount = addCount + 1;
		});
		cartStore.on('removeItems', () => {
			removeCount = removeCount + 1;
		});

		cartStore.addItems([results[0] as Product]);

		expect(addCount).toBe(1);

		cartStore.addItems([results[1] as Product]);

		expect(addCount).toBe(2);

		cartStore.addItems([results[2] as Product, results[3] as Product, results[4] as Product]);

		expect(addCount).toBe(3);

		cartStore.removeItems([results[0] as Product]);

		expect(removeCount).toBe(1);
		expect(emptiedCount).toBe(0);

		cartStore.removeItems([results[1] as Product]);

		expect(removeCount).toBe(2);
		expect(emptiedCount).toBe(0);

		cartStore.removeItems([results[2] as Product, results[3] as Product, results[4] as Product]);

		expect(cartStore.items.length).toBe(0);

		expect(removeCount).toBe(3);
		expect(emptiedCount).toBe(1);
		expect(resetCount).toBe(0);

		cartStore.addItems([results[2] as Product, results[3] as Product, results[4] as Product]);

		cartStore.reset();

		expect(resetCount).toBe(1);
		expect(cartStore.items.length).toBe(0);
	});
});
