import type { MetaResponseModel, SearchResponseModel, AutocompleteResponseModel } from '@searchspring/snapi-types';
import { Client, ClientGlobals, ClientConfig, TrendingResponseModel } from '@searchspring/snap-client';
import { MockData } from '../MockData/MockData';

/*
	// typical usage

	mockClient = new MockClient(globals);
	mockClient.mockData.updateConfig({ autocomplete: 'autocomplete' });

*/

export type MockConfig = {
	delay?: number;
};

export class MockClient extends Client {
	mockData: MockData;
	mockConfig: MockConfig;

	constructor(global: ClientGlobals, config: ClientConfig = {}, mockConfig: MockConfig = {}) {
		super(global, config);

		this.mockConfig = mockConfig;
		this.mockData = new MockData({ siteId: global.siteId });
	}

	async meta() {
		if (this.mockConfig.delay) await wait(this.mockConfig.delay);

		return this.mockData.meta();
	}

	async search() {
		const searchData = this.mockData.search();

		if (this.mockConfig.delay) await wait(this.mockConfig.delay);

		return Promise.all([this.meta() as MetaResponseModel, searchData as SearchResponseModel]);
	}

	async finder() {
		const searchData = this.mockData.search();

		if (this.mockConfig.delay) await wait(this.mockConfig.delay);

		return Promise.all([this.meta() as MetaResponseModel, searchData as SearchResponseModel]);
	}

	async autocomplete() {
		const autocompleteData = this.mockData.autocomplete();

		if (this.mockConfig.delay) await wait(this.mockConfig.delay);

		return Promise.all([this.meta() as MetaResponseModel, autocompleteData as AutocompleteResponseModel]);
	}

	async recommend() {
		if (this.mockConfig.delay) await wait(this.mockConfig.delay);

		return this.mockData.recommend();
	}

	async trending(): Promise<TrendingResponseModel> {
		if (this.mockConfig.delay) await wait(this.mockConfig.delay);

		return this.mockData.trending();
	}
}

function wait(time = 0) {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}
