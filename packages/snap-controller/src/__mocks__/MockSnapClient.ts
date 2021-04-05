/**
 * This class is used in Search, Autocomplete, and Finder controller tests 
 * to mock the snap client for returning mock data via SearchData
 * 
 * mockDataFile is the name of the mock data file to be used, ie:
 * this.client.mockDataFile = 'ac.query.blank.json' 
 * will use: /snap-controller/src/__mocks__/data/ga9kq2/searches/ac.query.blank.json
 * 
 */
import SnapClient from '@searchspring/snap-client-javascript';
import { SearchData } from './SearchData';

export class MockSnapClient extends SnapClient {
    mockDataFile = 'defaultNoQuery';

    constructor(global, config) {
        super(global, config)
    }
    
    async search() {
        const [results] = await Promise.all([
            new SearchData({search: this.mockDataFile})
        ]);
        return results;
    }
}