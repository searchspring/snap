import { QueryStore } from './QueryStore';

import { SearchData } from '../../__mocks__/SearchData';
import { mockSearchController } from '../../__mocks__/mockControllers';

describe('QueryStore store', () => {
	it('has undefined query on blank search', () => {
		const searchData = new SearchData();
		const queryStore = new QueryStore(mockSearchController, searchData.search);

		expect(queryStore).toBeDefined();
		expect(queryStore.query).toEqual(searchData.search.query);
		expect(queryStore.query).toEqual(undefined);
	});

	it('has didYouMean when search data has didYouMean', () => {
		const searchData = new SearchData({ search: 'dym' });
		const queryStore = new QueryStore(mockSearchController, searchData.search);

		expect(queryStore).toBeDefined();
		expect(queryStore.query).toBeDefined();
		expect(queryStore.query.string).toEqual(searchData.search.query);
		expect(queryStore.didYouMean).toBeDefined();
		expect(queryStore.didYouMean.string).toEqual(searchData.search.didYouMean);
		expect(queryStore.didYouMean.url).toBeDefined();
	});
});
