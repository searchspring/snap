import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { ProfileStore } from './ProfileStore';

import { SearchData } from '../../__mocks__/SearchData';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

describe('ProfileStore store', () => {
	it('does not create profile with bad data', () => {
		const store = new ProfileStore(services, {});
		expect(store.tag).toStrictEqual(undefined);
		expect(store.placement).toStrictEqual(undefined);
		expect(store.display).toStrictEqual({});
	});

	it('create profile using mock profile data', () => {
		const profile = new SearchData({ search: 'profile' }).profile;

		const store = new ProfileStore(services, profile);
		expect(store.tag).toStrictEqual(profile.tag);
		expect(store.placement).toStrictEqual(profile.placement);
		expect(store.display).toStrictEqual(profile.display);
	});
});
