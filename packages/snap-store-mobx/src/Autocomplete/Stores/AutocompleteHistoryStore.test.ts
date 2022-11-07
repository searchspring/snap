import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { AutocompleteHistoryStore } from './AutocompleteHistoryStore';
import { AutocompleteStateStore } from './AutocompleteStateStore';

const mockResetTerms = jest.fn();

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const rootState = new AutocompleteStateStore(services);
const mockData = new MockData();

describe('History Store', () => {
	it('has a symbol species of Array', () => {
		expect(AutocompleteHistoryStore[Symbol.species]).toBe(Array);
	});

	it('is empty when it is passed undefined', () => {
		// @ts-ignore
		const historyStore = new AutocompleteHistoryStore(services, undefined, mockResetTerms, rootState);

		expect(historyStore).toEqual([]);
	});

	it('is empty when it is passed no data', () => {
		// @ts-ignore
		const historyStore = new AutocompleteHistoryStore(services, [], mockResetTerms, rootState);

		expect(historyStore).toEqual([]);
	});

	it('contains the correct terms', () => {
		const historyData = ['dressred', 'dress', 'glasses'];
		const historyStore = new AutocompleteHistoryStore(services, historyData, mockResetTerms, rootState);
		expect(historyStore).toHaveLength(historyData.length);

		historyStore.forEach((term, index) => {
			expect(term).toHaveProperty('url');
			expect(term.url).toBeInstanceOf(UrlManager);
			expect(term).toHaveProperty('preview');
			expect(term.preview).toBeDefined();
			expect(term).toHaveProperty('active');
			expect(term.active).toEqual(false);
			expect(term).toHaveProperty('value');
			expect(term.value).toEqual(historyData[index]);
		});
	});

	it('has terms with undefined url properties when no controller is present', () => {
		const historyData = ['dressred', 'dress', 'glasses'];

		// @ts-ignore
		const historyStore = new AutocompleteHistoryStore(undefined, historyData, mockResetTerms, rootState);

		historyStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has terms with undefined url properties when no urlManager is present', () => {
		const services = {};

		const historyData = ['dressred', 'dress', 'glasses'];

		// @ts-ignore
		const historyStore = new AutocompleteHistoryStore(services, historyData, mockResetTerms, rootState);

		historyStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has a preview function on terms', () => {
		const historyData = ['dressred', 'dress', 'glasses'];

		const historyStore = new AutocompleteHistoryStore(services, historyData, mockResetTerms, rootState);

		expect(rootState.locks.terms.locked).toBe(false);

		historyStore.forEach((term) => {
			expect(term.active).toBe(false);
		});

		historyStore[0].preview();

		expect(mockResetTerms).toHaveBeenCalled();

		historyStore.forEach((term, index) => {
			expect(term.active).toBe(index === 0 ? true : false);
		});

		expect(rootState.locks.terms.locked).toBe(true);
	});
});
