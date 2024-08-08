import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { SearchHistoryStore } from './SearchHistoryStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

describe('History Store', () => {
	beforeEach(() => {
		// stores will share saved data unless config contains different siteId
		// this will reset that data for each test
		// @ts-ignore - imcomplete config
		const historyStore = new SearchHistoryStore({ services, config: {} });
		historyStore.reset();
	});

	it('has all functions we expect and terms are empty intially and works with empty config', () => {
		// @ts-ignore - imcomplete config
		const historyStore = new SearchHistoryStore({ services, config: {} });

		expect(historyStore.save).toBeDefined();
		expect(historyStore.remove).toBeDefined();
		expect(historyStore.queries).toEqual([]);
		expect(historyStore.getStoredData).toBeDefined();
		expect(historyStore.reset).toBeDefined();
	});

	it('contains the correct terms', () => {
		const historyData = ['dressred', 'dress', 'glasses'];
		// @ts-ignore - imcomplete config
		const historyStore = new SearchHistoryStore({ services, config: {} });
		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(historyData.length);

		historyData.reverse();
		historyStore.queries.forEach((query, index) => {
			expect(query).toHaveProperty('url');
			expect(query.url).toBeInstanceOf(UrlManager);
			expect(query).toHaveProperty('string');
			expect(query.string).toBe(historyData[index]);
			expect(query.url.href).toEqual(`/?q=${query.string}`);
		});
	});

	it('uses the same storage for other history stores when no siteId is provided', () => {
		const historyData = ['one', 'two', 'three'];
		// @ts-ignore - imcomplete config
		const historyStore = new SearchHistoryStore({ services, config: {} });
		historyData.map((term) => historyStore.save(term));

		historyData.reverse();

		expect(historyStore.queries).toHaveLength(historyData.length);
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(historyData[idx]);
		});

		// @ts-ignore - imcomplete config
		const historyStoreAgain = new SearchHistoryStore({ services, config: {} });
		expect(historyStoreAgain.queries).toHaveLength(historyData.length);
		historyStoreAgain.queries.map((term, idx) => {
			expect(term.string).toBe(historyData[idx]);
		});
	});

	it('uses the different storage for other history stores different siteIds are used', () => {
		const historyData = ['one', 'two', 'three'];
		const historyStore = new SearchHistoryStore({ services, config: { id: '', globals: { siteId: '123123' } } });
		historyData.map((term) => historyStore.save(term));

		historyData.reverse();

		expect(historyStore.queries).toHaveLength(historyData.length);
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(historyData[idx]);
		});

		const historyDataAgain = ['a', 'b', 'c'];
		const historyStoreAgain = new SearchHistoryStore({ services, config: { id: '', globals: { siteId: 'abcabc' } } });
		historyDataAgain.map((term) => historyStoreAgain.save(term));

		historyDataAgain.reverse();

		expect(historyStoreAgain.queries).toHaveLength(historyDataAgain.length);
		historyStoreAgain.queries.map((term, idx) => {
			expect(term.string).toBe(historyDataAgain[idx]);
		});
	});

	it('can be configured with a new urlRoot', () => {
		const rootUrl = '/collection/shop';
		const historyData = ['dressred', 'dress', 'glasses'];

		const historyStore = new SearchHistoryStore({ services, config: { id: '', settings: { history: { url: rootUrl } } } });

		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(historyData.length);

		historyData.reverse();
		historyStore.queries.forEach((query, index) => {
			expect(query).toHaveProperty('url');
			expect(query.url).toBeInstanceOf(UrlManager);
			expect(query).toHaveProperty('string');
			expect(query.string).toBe(historyData[index]);
			expect(query.url.href).toEqual(`${rootUrl}?q=${query.string}`);
		});
	});

	it('will push duplicated term to the beginning of the array when they are re-saved', () => {
		const historyData = ['one', 'two', 'three'];
		const historyStore = new SearchHistoryStore({ services, config: { siteId: '123123', id: '' } });
		historyData.map((term) => historyStore.save(term));

		historyData.reverse();

		expect(historyStore.queries).toHaveLength(historyData.length);
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(historyData[idx]);
		});

		historyStore.save('one');
		const duplicatedHistoryData = ['one', 'three', 'two'];
		expect(historyStore.queries).toHaveLength(historyData.length);
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(duplicatedHistoryData[idx]);
		});
	});

	it('can remove a term', () => {
		const initialHistoryData = ['dressred', 'dress', 'glasses'];

		// @ts-ignore - imcomplete config
		const historyStore = new SearchHistoryStore({ services, config: {} });
		initialHistoryData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(initialHistoryData.length);

		// remove 'dress'
		const removeQuery = 'dress';
		historyStore.remove(removeQuery);
		const alteredHistoryData = initialHistoryData.filter((query) => query != removeQuery);
		alteredHistoryData.reverse();

		expect(historyStore.queries).toHaveLength(alteredHistoryData.length);

		historyStore.queries.forEach((query, index) => {
			expect(query).toHaveProperty('url');
			expect(query.url).toBeInstanceOf(UrlManager);
			expect(query).toHaveProperty('string');
			expect(query.string).toBe(alteredHistoryData[index]);
		});
	});

	it('can reset all terms', () => {
		const historyData = ['dressred', 'dress', 'glasses'];

		// @ts-ignore - imcomplete config
		const historyStore = new SearchHistoryStore({ services, config: {} });
		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(historyData.length);

		historyStore.reset();

		expect(historyStore.queries).toHaveLength(0);
	});

	it('has a function to get stored data', () => {
		const historyData = ['dressred', 'dress', 'glasses'];

		// @ts-ignore - imcomplete config
		const historyStore = new SearchHistoryStore({ services, config: {} });
		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(historyData.length);

		historyData.reverse();
		const storedData = historyStore.getStoredData();
		expect(storedData).toStrictEqual(historyData);

		const limit = 2;
		const limitedReversedHistoryData = historyData.slice(0, limit);
		const limitedStoredData = historyStore.getStoredData(limit);
		expect(limitedStoredData).toStrictEqual(limitedReversedHistoryData);
	});

	it('has queries with undefined url properties when no services are present', () => {
		const historyData = ['dressred', 'dress', 'glasses'];
		// @ts-ignore - services is not present
		const historyStore = new SearchHistoryStore({ services: undefined, config: {} });
		historyData.map((term) => historyStore.save(term));

		historyStore.queries.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has queries with undefined url properties when no urlManager is present', () => {
		const services = {};
		const historyData = ['dressred', 'dress', 'glasses'];
		// @ts-ignore - urlManager is not present
		const historyStore = new SearchHistoryStore({ services, config: {} });
		historyData.map((term) => historyStore.save(term));

		historyStore.queries.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('listens to limit when config is passed', async () => {
		const historyData = ['dressred', 'dress', 'glasses', 'term', 'term2', 'term3', 'term4', 'term5'];
		const config = {
			id: '',
			settings: {
				history: {
					max: 5,
				},
			},
		};
		const historyStore = new SearchHistoryStore({ services, config });
		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(config.settings.history.max);
		const trimmedData = historyData.slice(historyData.length - config.settings.history.max).reverse();
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(trimmedData[idx]);
		});
	});

	it('trims terms when a different max configuration is provided', async () => {
		const historyData = ['dress', 'glasses', 'term', 'term2', 'term3', 'term4', 'term5'];

		const config = {
			id: '',
			settings: {
				history: {
					max: 20,
				},
			},
		};
		const historyStore = new SearchHistoryStore({ services, config });
		historyData.map((term) => historyStore.save(term));

		historyData.reverse();
		expect(historyStore.queries).toHaveLength(historyData.length);
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(historyData[idx]);
		});

		// new store uses same data as previous store so will trim the terms on construction
		new SearchHistoryStore({ services, config: { ...config, settings: { history: { max: 3 } } } });
		expect(historyStore.queries).toHaveLength(3);
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(historyData[idx]);
		});
	});

	it('empties history when max is changed to zero', async () => {
		const historyData = ['dressred', 'dress', 'glasses'];

		const config = {
			id: '',
			settings: {
				history: {
					max: 5,
				},
			},
		};
		const historyStore = new SearchHistoryStore({ services, config });
		historyData.map((term) => historyStore.save(term));

		historyData.reverse();
		expect(historyStore.queries).toHaveLength(historyData.length);
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(historyData[idx]);
		});

		// new store uses same data as previous store so will empty the terms on construction
		new SearchHistoryStore({ services, config: { ...config, settings: { history: { max: 0 } } } });
		expect(historyStore.queries).toHaveLength(0);
	});

	it('does not save when config max is zero', async () => {
		const config = {
			id: '',
			settings: {
				history: {
					max: 0,
				},
			},
		};
		const historyStore = new SearchHistoryStore({ services, config });
		historyStore.save('dont save');

		expect(historyStore.queries).toHaveLength(config.settings.history.max);
	});
});
