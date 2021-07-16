import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { TrendingStore } from './TrendingStore';
import { StateStore } from './StateStore';

import { SearchData } from '../../__mocks__/SearchData';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const rootState = new StateStore(services);

describe('Trending Store', () => {
	it('has a symbol species of Array', () => {
		expect(TrendingStore[Symbol.species]).toBe(Array);
	});

	it('is empty when it is passed undefined', () => {
		const termStore = new TrendingStore(services, undefined, rootState);

		expect(termStore).toEqual([]);
	});

	it('is empty when it is passed no data', () => {
		const termStore = new TrendingStore(services, {}, rootState);

		expect(termStore).toEqual([]);
	});

	it('contains the correct terms', () => {
		const searchData = new SearchData({ search: 'trending' });
		const trendingData = searchData.trending;
		const trendingStore = new TrendingStore(services, trendingData, rootState);
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
		const searchData = new SearchData({ search: 'trending' });
		const trendingData = searchData.trending;
		const trendingStore = new TrendingStore(undefined, trendingData, rootState);

		trendingStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has terms with undefined url properties when no urlManager is present', () => {
		const services = {
			config: {},
		};

		const searchData = new SearchData({ search: 'trending' });
		const trendingData = searchData.trending;
		const trendingStore = new TrendingStore(services, trendingData, rootState);

		trendingStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has a preview function on terms', () => {
		const searchData = new SearchData({ search: 'trending' });
		const trendingData = searchData.trending;
		const trendingStore = new TrendingStore(services, trendingData, rootState);

		expect(rootState.locks.terms.locked).toBe(false);

		trendingStore.forEach((term) => {
			expect(term.active).toBe(false);
		});

		trendingStore[0].preview();

		trendingStore.forEach((term, index) => {
			expect(term.active).toBe(index === 0 ? true : false);
		});

		expect(rootState.locks.terms.locked).toBe(true);
	});
});
