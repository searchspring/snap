import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { QueryStore } from './QueryStore';

import { SearchData } from '../../__mocks__/SearchData';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

describe('QueryStore store', () => {
	it('contains search', () => {
		const searchData = new SearchData({ search: 'autocomplete' });
		const queryStore = new QueryStore(services, searchData.autocomplete, searchData.search);
		expect(queryStore).toBeDefined();
		expect(queryStore.query).toBeDefined();
		expect(queryStore.query.string).toEqual(searchData.autocomplete.query);
		expect(queryStore.originalQuery).toBeUndefined();
	});

	it('contains originalQuery in search when corrected', () => {
		const searchData = new SearchData({ search: 'corrected' });
		const queryStore = new QueryStore(services, searchData.autocomplete, searchData.search);
		expect(queryStore).toBeDefined();
		expect(queryStore.query).toBeDefined();
		expect(queryStore.query.string).toStrictEqual(searchData.search.query);
		expect(queryStore.originalQuery).toBeDefined();
		expect(queryStore.originalQuery.string).toStrictEqual(searchData.autocomplete.query);
	});
});
