import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { SearchQueryStore } from './SearchQueryStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('SearchQueryStore store', () => {
	it('has undefined query on blank search', () => {
		const searchData = mockData.searchMeta();
		const queryStore = new SearchQueryStore(services, searchData.search!);

		expect(queryStore).toBeDefined();
		expect(queryStore.query).toEqual(undefined);
	});

	it('has didYouMean when search data has didYouMean', () => {
		const searchData = mockData.searchMeta('dym');

		const queryStore = new SearchQueryStore(services, searchData.search!);

		expect(queryStore).toBeDefined();
		expect(queryStore.query).toBeDefined();
		expect(queryStore.query?.string).toEqual(searchData.search?.query);
		expect(queryStore.didYouMean).toBeDefined();
		expect(queryStore.didYouMean?.string).toEqual(searchData.search?.didYouMean);
		expect(queryStore.didYouMean?.url).toBeDefined();
	});

	it('has matchType when search data has matchType', () => {
		const searchData = mockData.searchMeta('matchType');

		const queryStore = new SearchQueryStore(services, searchData.search!);

		expect(queryStore).toBeDefined();
		expect(queryStore.matchType).toEqual(searchData.search?.matchType);
	});
});
