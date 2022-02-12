import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { TrendingStore } from './TrendingStore';
import { StateStore } from './StateStore';

const mockResetTerms = jest.fn();

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const rootState = new StateStore(services);
const mockData = new MockData();

describe('Trending Store', () => {
	it('has a symbol species of Array', () => {
		expect(TrendingStore[Symbol.species]).toBe(Array);
	});

	it('is empty when it is passed undefined', () => {
		const termStore = new TrendingStore(services, undefined, mockResetTerms, rootState);

		expect(termStore).toEqual([]);
	});

	it('is empty when it is passed no data', () => {
		const termStore = new TrendingStore(services, {}, mockResetTerms, rootState);

		expect(termStore).toEqual([]);
	});

	it('contains the correct terms', () => {
		const searchData = mockData.trending();

		const trendingData = searchData.trending;
		const trendingStore = new TrendingStore(services, trendingData, mockResetTerms, rootState);
		expect(trendingStore).toHaveLength(trendingData.queries.length);

		trendingStore.forEach((term, index) => {
			expect(term).toHaveProperty('url');
			expect(term.url).toBeInstanceOf(UrlManager);
			expect(term).toHaveProperty('preview');
			expect(term.preview).toBeDefined();
			expect(term).toHaveProperty('active');
			expect(term.active).toEqual(false);
			expect(term).toHaveProperty('value');
			expect(term.value).toEqual(trendingData.queries[index].searchQuery);
		});
	});

	it('has terms with undefined url properties when no controller is present', () => {
		const searchData = mockData.trending();

		const trendingData = searchData.trending;
		const trendingStore = new TrendingStore(undefined, trendingData, mockResetTerms, rootState);

		trendingStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has terms with undefined url properties when no urlManager is present', () => {
		const services = {};

		const searchData = mockData.trending();

		const trendingData = searchData.trending;
		const trendingStore = new TrendingStore(services, trendingData, mockResetTerms, rootState);

		trendingStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has a preview function on terms', () => {
		const searchData = mockData.trending();

		const trendingData = searchData.trending;
		const trendingStore = new TrendingStore(services, trendingData, mockResetTerms, rootState);

		expect(rootState.locks.terms.locked).toBe(false);

		trendingStore.forEach((term) => {
			expect(term.active).toBe(false);
		});

		trendingStore[0].preview();

		expect(mockResetTerms).toHaveBeenCalled();

		trendingStore.forEach((term, index) => {
			expect(term.active).toBe(index === 0 ? true : false);
		});

		expect(rootState.locks.terms.locked).toBe(true);
	});
});
