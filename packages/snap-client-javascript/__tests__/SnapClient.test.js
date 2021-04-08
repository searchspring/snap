
import SnapClient from '../src/index.js';
import superagent from 'superagent';
import metaResponse from '../__fixtures__/metaResponse';
import searchResponse from '../__fixtures__/searchResponse';
import autocompleteResponse from '../__fixtures__/autocompleteResponse';

// models
import searchResponseModel from '../src/model/SearchResponseModel';
import autocompleteResponseModel from '../src/model/AutocompleteResponseModel';

const mockSuperAgent = superagent();

beforeEach(() => {
	mockSuperAgent.__setMockError(null);
	mockSuperAgent.__setMockResponse({
		get: jest.fn(),
		ok: true,
		status: 200,
		toError: jest.fn(),
	});
});

describe('SNAP Client', () => {
	it('requires a siteId during construction', () => {
		expect(() => {
			new SnapClient();
		}).toThrow();

		expect(() => {
			new SnapClient({});
		}).toThrow();

		expect(() => {
			new SnapClient({ siteId: '' });
		}).toThrow();

		expect(() => {
			new SnapClient({ siteId: 'scmq7n' });
		}).not.toThrow();
	});

	it('does not prefetch meta when option is not set', done => {
		let client = new SnapClient({ siteId: 'scmq7n' });

		setTimeout(() => {
			try {
				expect(client.meta).toBeUndefined();
				done();
			} catch(err) {
				done(err);
			}
		});
	});

	it('does prefetch meta when option is set', done => {
		mockSuperAgent.__setMockResponseBody(metaResponse.data);
		let client = new SnapClient({ siteId: 'scmq7n' }, { meta: { prefetch: true }});

		setTimeout(() => {
			try {
				expect(client.meta).toEqual(metaResponse.data);
				done();
			} catch(err) {
				done(err);
			}
		});
	});

	it('does keep a cache of the meta data', () => {
		let client = new SnapClient({ siteId: 'scmq7n' });
		
		expect(client.meta).toEqual(metaResponse.data);
	});

	it('does search', done => {
		mockSuperAgent.__setMockResponseBody(searchResponse.data);
		let client = new SnapClient({ siteId: 'scmq7n' });

		setTimeout(async () => {
			try {
				let results = await client.search();
				expect(results).toEqual(searchResponseModel.constructFromObject(searchResponse.data));
				done();
			} catch(err) {
				done(err);
			}
		});
	});

	it('does autocomplete', done => {
		mockSuperAgent.__setMockResponseBody(autocompleteResponse.data);
		let client = new SnapClient({ siteId: 'scmq7n' });

		setTimeout(async () => {
			try {
				let results = await client.autocomplete();
				expect(results).toEqual(autocompleteResponseModel.constructFromObject(autocompleteResponse.data));
				done();
			} catch(err) {
				done(err);
			}
		});
	});
});