import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { SearchMerchandisingStore } from './SearchMerchandisingStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('Merchandising Store', () => {
	const emptyMerchStore = { redirect: '', content: {}, campaigns: [] };

	it('is empty when not passed valid params', () => {
		// @ts-ignore
		let merchStore = new SearchMerchandisingStore(services, undefined);
		expect(merchStore).toEqual(emptyMerchStore);

		// @ts-ignore
		merchStore = new SearchMerchandisingStore(services, undefined);
		expect(merchStore).toEqual(emptyMerchStore);

		// @ts-ignore
		merchStore = new SearchMerchandisingStore(undefined, {});
		expect(merchStore).toEqual(emptyMerchStore);

		merchStore = new SearchMerchandisingStore(services, {});
		expect(merchStore).toEqual(emptyMerchStore);
	});

	it('has banner content', () => {
		const data = mockData.searchMeta('merchandising');
		const merchStore = new SearchMerchandisingStore(services, data.merchandising!);

		expect(merchStore.content).toEqual(data.merchandising?.content!);
	});

	it('has more banner content', () => {
		const data = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');
		const merchStore = new SearchMerchandisingStore(services, data.merchandising!);

		expect(merchStore.content).toEqual(data.merchandising?.content);
	});

	it('has redirect', () => {
		const data = mockData.resetConfig().searchMeta('redirect');
		const merchStore = new SearchMerchandisingStore(services, data.merchandising!);
		expect(merchStore.redirect).toEqual(data.merchandising?.redirect);
	});

	it('has campaigns', () => {
		const data = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');
		const merchStore = new SearchMerchandisingStore(services, data.merchandising!);
		expect(merchStore.campaigns).toEqual(data.merchandising?.campaigns);
	});

	it('updates landingPage when landing page is found', () => {
		const data = mockData.updateConfig({ siteId: 'ga9kq2', search: 'landingPage' }).searchMeta();

		const merchStore = new SearchMerchandisingStore(services, data.merchandising!);

		expect(merchStore.campaigns).toBeDefined();
		expect(merchStore.campaigns).toEqual(data.merchandising?.campaigns);

		expect(merchStore.landingPage).toEqual(data?.merchandising?.campaigns![0]);
	});
});
