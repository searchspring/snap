import { MockData } from '@searchspring/snap-shared';
import { CartStore } from './CartStore';
import { Product, SearchResultStore } from '../Search/Stores/SearchResultStore';

const _mockData = new MockData();

const searchConfig = {
	id: 'search',
};

const mockData = _mockData.recommend();
const results = new SearchResultStore({
	config: searchConfig,
	state: {
		loaded: true,
	},
	data: {
		search: {
			results: mockData.recommend.results,
		},
		meta: _mockData.meta(),
	},
});

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

	it('will ensure price and MSRP are numbers', () => {
		const cartStore = new CartStore();
		const result = results[0] as Product;
		result.quantity = 1;

		// @ts-ignore - sometimes the values in variant data can be strings
		result.mask.set({ mappings: { core: { msrp: '0.00' } } });

		cartStore.addItems([result]);

		expect(cartStore.items).toHaveLength(1);
		expect(cartStore.count).toStrictEqual(1);
		expect(cartStore.price).toStrictEqual(result.display.mappings.core?.price);
		expect(cartStore.msrp).toStrictEqual(result.display.mappings.core?.price);
	});

	it('price and MSRP handle floating 0s', () => {
		const cartStore = new CartStore();
		const result = results[0] as Product;
		result.quantity = 1;

		// @ts-ignore - sometimes the values in variant data can be strings
		result.mask.set({ mappings: { core: { msrp: 17.8, price: 16.8 } } });

		cartStore.addItems([result]);

		const result2 = results[1] as Product;
		result2.quantity = 1;

		// @ts-ignore - sometimes the values in variant data can be strings
		result2.mask.set({ mappings: { core: { msrp: 36.3, price: 34.3 } } });

		cartStore.addItems([result2]);

		expect(cartStore.items).toHaveLength(2);
		expect(cartStore.count).toStrictEqual(2);
		expect(cartStore.price).toStrictEqual(51.1);
		expect(cartStore.msrp).toStrictEqual(54.1);
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
