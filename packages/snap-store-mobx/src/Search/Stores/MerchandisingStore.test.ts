import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { MerchandisingStore } from './MerchandisingStore';

import { SearchData } from '../../__mocks__/SearchData';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

describe('Merchandising Store', () => {
	const emptyMerchStore = { redirect: '', content: {} };

	it('is empty when not passed valid params', () => {
		let merchStore = new MerchandisingStore(undefined, undefined);
		expect(merchStore).toEqual(emptyMerchStore);

		merchStore = new MerchandisingStore(services, undefined);
		expect(merchStore).toEqual(emptyMerchStore);

		merchStore = new MerchandisingStore(undefined, {});
		expect(merchStore).toEqual(emptyMerchStore);

		merchStore = new MerchandisingStore(services, {});
		expect(merchStore).toEqual(emptyMerchStore);
	});

	it('has banner content', () => {
		const data = new SearchData({ search: 'merchandising' });
		const merchStore = new MerchandisingStore(services, data.merchandising);

		expect(merchStore.content).toEqual(data.merchandising.content);
	});

	it('has more banner content', () => {
		const data = new SearchData({ siteId: 'ga9kq2', search: 'merchandising_page1' });
		const merchStore = new MerchandisingStore(services, data.merchandising);

		expect(merchStore.content).toEqual(data.merchandising.content);
	});

	it('has redirect', () => {
		const data = new SearchData({ search: 'redirect' });
		const merchStore = new MerchandisingStore(services, data.merchandising);
		expect(merchStore.redirect).toEqual(data.merchandising.redirect);
	});
});
