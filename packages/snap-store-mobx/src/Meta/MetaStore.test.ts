import { MockData } from '@searchspring/snap-shared';

import { MetaStore } from './MetaStore';

import { MetaResponseModel } from '@searchspring/snapi-types';

describe('Meta Store', () => {
	const mockData = new MockData();
	let metaData: MetaResponseModel;

	beforeEach(() => {
		metaData = mockData.searchMeta().meta;
	});

	it('can construct without metaData', () => {
		const store = new MetaStore();
		expect(store.data).toEqual({});
		expect(store.badges.groups.overlay).toStrictEqual({ sections: ['left', 'right'], grid: [] });
	});

	it('has badges in mock meta data', () => {
		expect(metaData?.badges).toBeDefined();
		expect(metaData?.badges?.locations?.left).toBeDefined();
		expect(metaData?.badges?.locations?.right).toBeDefined();
		expect(metaData?.badges?.locations?.callout).toBeDefined();

		expect(metaData?.badges?.locations.left.length).toBeGreaterThan(0);
		expect(metaData?.badges?.locations.right.length).toBeGreaterThan(0);

		expect(metaData?.badges?.locations.callout.length).toBeGreaterThan(0);

		expect(metaData?.badges?.tags).toBeDefined();
		expect(Object.keys(metaData?.badges?.tags || {}).length).toBeGreaterThan(0);
	});

	it('can construct given meta data', () => {
		const store = new MetaStore(metaData);
		expect(store.data).toStrictEqual(metaData);
		expect(store.badges.groups.overlay).toStrictEqual({
			sections: ['left', 'right'],
			grid: [
				['left-upper', 'right-upper'],
				['left-middle-upper', 'right-middle-upper'],
				['left-middle', 'right-middle'],
				['left-middle-lower', 'right-middle-lower'],
				['left-lower', 'right-lower'],
			],
		});
	});
});
