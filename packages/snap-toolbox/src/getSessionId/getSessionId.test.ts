import 'whatwg-fetch';
import { getSessionId, PAGELOADID_STORAGE_NAME } from './getSessionId';

const defaultCacheKey = 'ssSessionIdNamespace';

describe('getSessionId', () => {
	let mockStorage: {
		[key: string]: string;
	} = {};

	global.Storage.prototype.setItem = jest.fn((key, value) => {
		mockStorage[key] = value;
	});
	global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);

	let id: string | undefined;
	let id2: string | undefined;
	let id3: string | undefined;
	let id4: string | undefined;

	it('can call and return an id', () => {
		id = getSessionId();
		expect(id).toBeDefined();
		expect(id).toHaveLength(36);

		expect(mockStorage[defaultCacheKey]).toBe(id);
	});

	it('will return the same id when called again', async () => {
		id2 = getSessionId();

		expect(id2).toBeDefined();
		expect(id2).toEqual(id);
	});

	it('can pass in an alternate key', async () => {
		id3 = getSessionId(PAGELOADID_STORAGE_NAME);

		expect(mockStorage[PAGELOADID_STORAGE_NAME]).toBe(id3);
		expect(id3).toBeDefined();
		expect(id3).not.toEqual(id);
	});

	it('can use the fresh start param', async () => {
		id4 = getSessionId(PAGELOADID_STORAGE_NAME, true);

		expect(mockStorage[PAGELOADID_STORAGE_NAME]).toBe(id4);
		expect(id4).toBeDefined();
		expect(id4).not.toEqual(id3);

		// return our mocks to their original values
		//@ts-ignore
		global.Storage.prototype.setItem.mockReset();
		//@ts-ignore
		global.Storage.prototype.getItem.mockReset();
	});
});
