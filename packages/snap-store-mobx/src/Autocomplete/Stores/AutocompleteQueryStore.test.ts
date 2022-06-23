import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { AutocompleteQueryStore } from './AutocompleteQueryStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const mockData = new MockData();

describe('AutocompleteQueryStore store', () => {
	it('contains search', () => {
		const searchData = mockData.autocompleteMeta();

		const queryStore = new AutocompleteQueryStore(services, searchData.autocomplete!, searchData.search!);
		expect(queryStore).toBeDefined();
		expect(queryStore.query).toBeDefined();
		expect(queryStore.query?.string).toEqual(searchData.autocomplete?.query);
		expect(queryStore.originalQuery).toBeUndefined();
	});

	it('contains originalQuery in search when corrected', () => {
		const searchData = mockData.autocompleteMeta('corrected');

		const queryStore = new AutocompleteQueryStore(services, searchData.autocomplete!, searchData.search!);
		expect(queryStore).toBeDefined();
		expect(queryStore.query).toBeDefined();
		expect(queryStore.query?.string).toStrictEqual(searchData.search?.query);
		expect(queryStore.originalQuery).toBeDefined();
		expect(queryStore.originalQuery?.string).toStrictEqual(searchData.autocomplete?.query);
	});
});
