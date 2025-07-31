import { MockData } from '@searchspring/snap-shared';

import { SearchMerchandisingStore } from './SearchMerchandisingStore';

const mockData = new MockData();

describe('Merchandising Store', () => {
	const emptyMerchStore = { redirect: '', personalized: false, experiments: [], content: {}, campaigns: [] };

	it('is empty when not passed valid params', () => {
		// @ts-ignore - empty constructor
		let merchStore = new SearchMerchandisingStore();
		expect(merchStore).toEqual(emptyMerchStore);

		merchStore = new SearchMerchandisingStore({
			data: {
				// @ts-ignore - no search data
				search: undefined,
			},
		});
		expect(merchStore).toEqual(emptyMerchStore);

		merchStore = new SearchMerchandisingStore({
			data: {
				search: {},
			},
		});
		expect(merchStore).toEqual(emptyMerchStore);
	});

	it('has banner content', () => {
		const data = mockData.searchMeta('merchandising');
		const merchStore = new SearchMerchandisingStore({
			data: {
				search: data.search,
			},
		});

		expect(merchStore.content).toEqual(data.search.merchandising?.content!);
	});

	it('has more banner content', () => {
		const data = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');
		const merchStore = new SearchMerchandisingStore({
			data: {
				search: data.search,
			},
		});

		expect(merchStore.content).toEqual(data.search.merchandising?.content);
	});

	it('has redirect', () => {
		const data = mockData.resetConfig().searchMeta('redirect');
		const merchStore = new SearchMerchandisingStore({
			data: {
				search: data.search,
			},
		});
		expect(merchStore.redirect).toEqual(data.search.merchandising?.redirect);
	});

	it('has campaigns', () => {
		const data = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');
		const merchStore = new SearchMerchandisingStore({
			data: {
				search: data.search,
			},
		});
		expect(merchStore.campaigns).toEqual(data.search.merchandising?.campaigns);
	});

	it('has personalized bool', () => {
		const data = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');
		const merchStore = new SearchMerchandisingStore({
			data: {
				search: data.search,
			},
		});
		expect(merchStore.personalized).toEqual(data.search.merchandising?.personalized);
	});

	it('updates landingPage when landing page is found', () => {
		const data = mockData.updateConfig({ siteId: 'ga9kq2', search: 'landingPage' }).searchMeta();

		const merchStore = new SearchMerchandisingStore({
			data: {
				search: data.search,
			},
		});

		expect(merchStore.campaigns).toBeDefined();
		expect(merchStore.campaigns).toEqual(data.search.merchandising?.campaigns);

		expect(merchStore.landingPage).toEqual(data?.search.merchandising?.campaigns![0]);
	});
});
