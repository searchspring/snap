/**
 * This class is used in Search, Autocomplete, and Finder controller tests
 * to mock the snap client for returning mock data via SearchData
 *
 * mockDataFile is the name of the mock data file to be used, ie:
 * this.client.mockDataFile = 'ac.query.blank.json'
 * will use: /snap-controller/src/__mocks__/data/ga9kq2/searches/ac.query.blank.json
 *
 */
import { Client } from '@searchspring/snap-client';
import { SearchData } from './SearchData';

export class MockClient extends Client {
	mockDataFile = 'defaultNoQuery';

	constructor(global, config) {
		super(global, config);
	}

	async search() {
		const [results] = await Promise.all([new SearchData({ search: this.mockDataFile })]);
		return results;
	}

	async autocomplete() {
		const [results] = await Promise.all([new SearchData({ search: this.mockDataFile })]);
		return results;
	}
}
