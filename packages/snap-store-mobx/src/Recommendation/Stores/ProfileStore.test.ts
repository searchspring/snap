import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { ProfileStore } from './ProfileStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('ProfileStore store', () => {
	it('does not create profile with bad data', () => {
		const store = new ProfileStore(services, {});
		expect(store.tag).toStrictEqual(undefined);
		expect(store.placement).toStrictEqual(undefined);
		expect(store.display).toStrictEqual({});
	});

	it('create profile using mock profile data', () => {
		const profile = mockData.recommend().profile;
		console.log('profile?', profile);

		const store = new ProfileStore(services, profile);
		expect(store.tag).toStrictEqual(profile.tag);
		expect(store.placement).toStrictEqual(profile.placement);
		expect(store.display).toStrictEqual(profile.display);
	});
});
