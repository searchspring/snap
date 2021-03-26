import { QueryStore } from './QueryStore';

import { SearchData } from '../../__mocks__/SearchData';

describe('QueryStore store', () => {
	it('contains search', () => {
		const searchData = new SearchData({ search: 'autocomplete' });
		const queryStore = new QueryStore(searchData.autocomplete, searchData.search);
		expect(queryStore).toBeDefined();
		expect(queryStore.query).toEqual(searchData.autocomplete.query);
		expect(queryStore.originalQuery).toBeUndefined();
	});

	it('contains originalQuery in search when corrected', () => {
		const searchData = new SearchData({ search: 'corrected' });
		const queryStore = new QueryStore(searchData.autocomplete, searchData.search);
		expect(queryStore).toBeDefined();
		expect(queryStore.query).toStrictEqual(searchData.autocomplete.correctedQuery);
		expect(queryStore.query).toStrictEqual(searchData.search.query);
		expect(queryStore.originalQuery).toStrictEqual(searchData.autocomplete.query);
	});
});
