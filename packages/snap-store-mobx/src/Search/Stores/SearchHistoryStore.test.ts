import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { SearchHistoryStore } from './SearchHistoryStore';
import { AutocompleteStateStore } from '../../Autocomplete/Stores/AutocompleteStateStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const rootState = new AutocompleteStateStore(services);

describe('History Store', () => {
	it('has all functions we expect and terms are empty intially and works with config passed as undefined', () => {
		const historyStore = new SearchHistoryStore(services, undefined, rootState);

		expect(historyStore.saveToHistory).toBeDefined();
		expect(historyStore.terms).toEqual([]);
		expect(historyStore.storedHistory).toBeDefined();
		expect(historyStore.resetHistory).toBeDefined();
	});

	it('works without rootState passed', () => {
		const historyStore = new SearchHistoryStore(services);

		expect(historyStore.saveToHistory).toBeDefined();
		expect(historyStore.terms).toEqual([]);
		expect(historyStore.storedHistory).toBeDefined();
		expect(historyStore.resetHistory).toBeDefined();
	});

	it('contains the correct terms', () => {
		const historyData = ['dressred', 'dress', 'glasses'];
		const historyStore = new SearchHistoryStore(services, undefined, rootState);
		historyData.map((term) => historyStore.saveToHistory(term));

		expect(historyStore.terms).toHaveLength(historyData.length);

		historyStore.terms.forEach((term, index) => {
			expect(term).toHaveProperty('url');
			expect(term.url).toBeInstanceOf(UrlManager);
			expect(term).toHaveProperty('preview');
			expect(term.preview).toBeDefined();
			expect(term).toHaveProperty('active');
			expect(term.active).toEqual(false);
			expect(term).toHaveProperty('value');
			expect(term.value).toEqual(historyData.reverse()[index]);
		});
	});

	it('has terms with undefined url properties when no controller is present', () => {
		const historyData = ['dressred', 'dress', 'glasses'];
		// @ts-ignore
		const historyStore = new SearchHistoryStore(undefined, undefined, rootState);
		historyData.map((term) => historyStore.saveToHistory(term));

		historyStore.terms.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has terms with undefined url properties when no urlManager is present', () => {
		const services = {};
		const historyData = ['dressred', 'dress', 'glasses'];
		// @ts-ignore
		const historyStore = new SearchHistoryStore(services, undefined, rootState);
		historyData.map((term) => historyStore.saveToHistory(term));
		historyStore.terms.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has a preview function on terms', async () => {
		const historyData = ['dressred', 'dress', 'glasses'];

		const historyStore = new SearchHistoryStore(services, undefined, rootState);

		historyData.map((term) => historyStore.saveToHistory(term));

		expect(rootState.locks.terms.locked).toBe(false);

		historyStore.terms.forEach((term) => {
			expect(term.active).toBe(false);
		});

		historyStore.terms[0].preview();

		historyStore.terms.forEach((term, index) => {
			expect(term.active).toBe(index === 0 ? true : false);
		});

		expect(rootState.locks.terms.locked).toBe(true);
	});

	it('listens to limit when config is passed', async () => {
		const historyData = ['dressred', 'dress', 'glasses', 'term', 'term2', 'term3', 'term4', 'term5'];
		const config = {
			limit: 5,
		};
		const historyStore = new SearchHistoryStore(services, config, rootState);
		historyData.map((term) => historyStore.saveToHistory(term));

		expect(historyStore.terms).toHaveLength(config.limit);
		let trimmedData = historyData.slice(historyData.length - config.limit).reverse();
		historyStore.terms.map((term, idx) => {
			expect(term.value).toBe(trimmedData[idx]);
		});
	});
});
