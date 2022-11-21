import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { RecommendationProfileStore } from './RecommendationProfileStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('RecommendationProfileStore store', () => {
	it('does not create profile with bad data', () => {
		// @ts-ignore
		const store = new RecommendationProfileStore(services, {});
		expect(store.tag).toStrictEqual(undefined);
		expect(store.placement).toStrictEqual(undefined);
		expect(store.display).toStrictEqual({});
	});

	it('create profile using mock profile data', () => {
		const data = mockData.recommend();

		const store = new RecommendationProfileStore(services, data);
		expect(store.tag).toStrictEqual(data.profile.tag);
		expect(store.placement).toStrictEqual(data.profile.placement);
		expect(store.display).toStrictEqual(data.profile.display);
	});
});
