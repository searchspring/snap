import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { MerchandisingStore } from './MerchandisingStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

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
		const data = mockData.searchMeta('merchandising');
		const merchStore = new MerchandisingStore(services, data.merchandising);

		expect(merchStore.content).toEqual(data.merchandising.content);
	});

	it('has more banner content', () => {
		const data = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');
		const merchStore = new MerchandisingStore(services, data.merchandising);

		expect(merchStore.content).toEqual(data.merchandising.content);
	});

	it('has redirect', () => {
		const data = mockData.resetConfig().searchMeta('redirect');
		const merchStore = new MerchandisingStore(services, data.merchandising);
		expect(merchStore.redirect).toEqual(data.merchandising.redirect);
	});
});
