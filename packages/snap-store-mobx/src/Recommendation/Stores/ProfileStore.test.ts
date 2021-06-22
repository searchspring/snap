import { ProfileStore } from './ProfileStore';

import { SearchData } from '../../__mocks__/SearchData';
import { mockRecommendationController } from '../../__mocks__/mockControllers';

describe('ProfileStore store', () => {
	it('does not create profile with bad data', () => {
		const store = new ProfileStore(mockRecommendationController, {});
		expect(store.tag).toStrictEqual(undefined);
		expect(store.placement).toStrictEqual(undefined);
		expect(store.display).toStrictEqual({});
	});

	it('create profile using mock profile data', () => {
		const profile = new SearchData({ search: 'profile' }).profile;

		const store = new ProfileStore(mockRecommendationController, profile);
		expect(store.tag).toStrictEqual(profile.tag);
		expect(store.placement).toStrictEqual(profile.placement);
		expect(store.display).toStrictEqual(profile.display);
	});
});
