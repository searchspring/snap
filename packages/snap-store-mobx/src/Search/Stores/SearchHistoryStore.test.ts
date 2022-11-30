import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { SearchHistoryStore } from './SearchHistoryStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

describe('History Store', () => {
	it('has all functions we expect and terms are empty intially and works with empty config', () => {
		const historyStore = new SearchHistoryStore({}, services);

		expect(historyStore.save).toBeDefined();
		expect(historyStore.remove).toBeDefined();
		expect(historyStore.queries).toEqual([]);
		expect(historyStore.getStoredData).toBeDefined();
		expect(historyStore.reset).toBeDefined();
	});

	it('contains the correct terms', () => {
		const historyData = ['dressred', 'dress', 'glasses'];
		const historyStore = new SearchHistoryStore({}, services);
		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(historyData.length);
		const reversedHistoryData = historyData.reverse();

		historyStore.queries.forEach((query, index) => {
			expect(query).toHaveProperty('url');
			expect(query.url).toBeInstanceOf(UrlManager);
			expect(query).toHaveProperty('string');
			expect(query.string).toBe(reversedHistoryData[index]);
		});
	});

	it('can remove a term', () => {
		const initialHistoryData = ['dressred', 'dress', 'glasses'];

		const historyStore = new SearchHistoryStore({}, services);
		initialHistoryData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(initialHistoryData.length);

		// remove 'dress'
		const removeQuery = 'dress';
		historyStore.remove(removeQuery);
		const alteredHistoryData = initialHistoryData.filter((query) => query != removeQuery);
		const reversedAlteredHistoryData = alteredHistoryData.reverse();

		expect(historyStore.queries).toHaveLength(alteredHistoryData.length);

		historyStore.queries.forEach((query, index) => {
			console.log('string', query.string);
			expect(query).toHaveProperty('url');
			expect(query.url).toBeInstanceOf(UrlManager);
			expect(query).toHaveProperty('string');
			expect(query.string).toBe(reversedAlteredHistoryData[index]);
		});
	});

	it('can reset all terms', () => {
		const historyData = ['dressred', 'dress', 'glasses'];

		const historyStore = new SearchHistoryStore({}, services);
		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(historyData.length);

		historyStore.reset();

		expect(historyStore.queries).toHaveLength(0);
	});

	it('has a function to get stored data', () => {
		const historyData = ['dressred', 'dress', 'glasses'];

		const historyStore = new SearchHistoryStore({}, services);
		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(historyData.length);

		const reversedHistoryData = historyData.reverse();
		const storedData = historyStore.getStoredData();
		expect(storedData).toStrictEqual(reversedHistoryData);

		const limit = 2;
		const limitedReversedHistoryData = reversedHistoryData.slice(0, limit);
		const limitedStoredData = historyStore.getStoredData(limit);
		expect(limitedStoredData).toStrictEqual(limitedReversedHistoryData);
	});

	it('has queries with undefined url properties when no services are present', () => {
		const historyData = ['dressred', 'dress', 'glasses'];
		// @ts-ignore
		const historyStore = new SearchHistoryStore({}, undefined);
		historyData.map((term) => historyStore.save(term));

		historyStore.queries.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has queries with undefined url properties when no urlManager is present', () => {
		const services = {};
		const historyData = ['dressred', 'dress', 'glasses'];
		// @ts-ignore
		const historyStore = new SearchHistoryStore({}, services);
		historyData.map((term) => historyStore.save(term));

		historyStore.queries.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('listens to limit when config is passed', async () => {
		const historyData = ['dressred', 'dress', 'glasses', 'term', 'term2', 'term3', 'term4', 'term5'];
		const config = {
			limit: 5,
		};
		const historyStore = new SearchHistoryStore(config, services);
		historyData.map((term) => historyStore.save(term));

		expect(historyStore.queries).toHaveLength(config.limit);
		let trimmedData = historyData.slice(historyData.length - config.limit).reverse();
		historyStore.queries.map((term, idx) => {
			expect(term.string).toBe(trimmedData[idx]);
		});
	});
});
