import type { MetaResponseModel, SearchResponseModel, AutocompleteResponseModel } from '@searchspring/snapi-types';
import { Client } from '@searchspring/snap-client';
import { MockData } from '../MockData/MockData';

/*
	// typical usage

	mockClient = new MockClient(globals);
	mockClient.mockData.updateConfig({ autocomplete: 'autocomplete' });

*/

export class MockClient extends Client {
	mockData: MockData;

	constructor(global, config) {
		super(global, config);

		this.mockData = new MockData({ siteId: global.siteId });
	}

	async meta() {
		return this.mockData.meta();
	}

	async search() {
		const searchData = this.mockData.search();

		return Promise.all([this.meta() as MetaResponseModel, searchData as SearchResponseModel]);
	}

	async autocomplete() {
		const autocompleteData = this.mockData.autocomplete();

		return Promise.all([this.meta() as MetaResponseModel, autocompleteData as AutocompleteResponseModel]);
	}
}
