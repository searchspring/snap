import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { RecommendationStore } from './RecommendationStore';

import { SearchData } from '../__mocks__/SearchData';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

describe('RecommendationStore store', () => {
	it('can create empty RecommendationsStore', () => {
		const store = new RecommendationStore({}, services);
		expect(store.loaded).toBe(false);
		expect(store.profile).toEqual({ display: {} });
		expect(store.results).toStrictEqual([]);
	});

	it('can create RecommendationsStore with mock data', () => {
		const profile = new SearchData({ search: 'profile' }).profile;
		const results = new SearchData({ search: 'recommend' })[0].results;
		const data = { profile, results };

		const store = new RecommendationStore({}, services);
		store.update(data);

		expect(store.loaded).toBe(true);

		expect(store.profile.tag).toBe(data.profile.tag);
		expect(store.profile.placement).toBe(data.profile.placement);
		expect(store.profile.display).toStrictEqual(data.profile.display);

		expect(store.results).toHaveLength(data.results.length);
		expect(store.results[0].type).toBe('product');
		expect(store.results[0].id).toStrictEqual(data.results[0].id);
		expect(store.results[0].mappings).toStrictEqual(data.results[0].mappings);
		expect(store.results[0].attributes).toStrictEqual(data.results[0].attributes);
	});
});
