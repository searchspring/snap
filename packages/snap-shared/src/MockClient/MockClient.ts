import type { MetaResponseModel, SearchResponseModel, AutocompleteResponseModel } from '@searchspring/snapi-types';
import { Client } from '@searchspring/snap-client';
import { MockData } from '../MockData/MockData';
import { TrendingRequestModel, TrendingResponseModel } from '../../../snap-client/src/Client/apis';
import type { ClientGlobals, ClientConfig } from '../../../snap-client/src/types';

/*
	// typical usage

	mockClient = new MockClient(globals);
	mockClient.mockData.updateConfig({ autocomplete: 'autocomplete' });

*/

export class MockClient extends Client {
	mockData: MockData;

	constructor(global: ClientGlobals, config: ClientConfig = {}) {
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

	async trending(): Promise<TrendingResponseModel> {
		return this.mockData.trending();
	}
}
