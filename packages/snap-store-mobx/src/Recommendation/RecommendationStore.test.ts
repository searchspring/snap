import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { RecommendationStore } from './RecommendationStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('RecommendationStore store', () => {
	it('can create empty RecommendationsStore', () => {
		const recommendationConfig = {
			id: 'rec',
			tag: 'trending',
		};
		const store = new RecommendationStore(recommendationConfig, services);
		expect(store.loaded).toBe(false);
		expect(store.profile).toStrictEqual({});
		expect(store.results).toStrictEqual([]);
	});

	it('can create RecommendationsStore with mock data', () => {
		const data = mockData.recommend();

		const recommendationConfig = {
			id: 'rec',
			tag: data.profile.tag,
		};

		const store = new RecommendationStore(recommendationConfig, services);
		store.update(data);

		expect(store.loaded).toBe(true);

		expect(store.profile?.tag).toBe(data.profile.profile.tag);
		expect(store.profile?.placement).toBe(data.profile.profile.placement);
		expect(store.profile?.display).toStrictEqual(data.profile.profile.display);

		expect(store.results).toHaveLength(data.recommend.results.length);
		expect(store.results && store.results[0].type).toBe('product');
		expect(store.results && store.results[0].id).toStrictEqual(data.recommend.results[0].id);
		expect(store.results && store.results[0].mappings).toStrictEqual(data.recommend.results[0].mappings);
		expect(store.results && store.results[0].attributes).toStrictEqual(data.recommend.results[0].attributes);
	});
});
