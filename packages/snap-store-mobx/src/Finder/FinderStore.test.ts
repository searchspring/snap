import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { FinderStore } from './FinderStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const mockData = new MockData({ siteId: 'ga9kq2', search: 'hierarchy' });
const searchData = mockData.searchMeta();

describe('Finder Store', () => {
	const config = {
		id: 'finder',
		url: '/',
		fields: [
			{
				label: 'Accessory',
				field: 'ss_accessory',
				levels: ['Type', 'Year', 'Make', 'Model'],
			},
		],
	};

	it('returns correct initial state', () => {
		const finderStore = new FinderStore(config, services);

		expect(finderStore.loaded).toBe(false);

		expect(finderStore.meta).toBeDefined();
		expect(finderStore.meta).toStrictEqual({});

		expect(finderStore.pagination).toBeDefined();
		expect(finderStore.pagination.totalResults).toBeUndefined();

		expect(finderStore.selections).toBeDefined();
		expect(finderStore.selections).toHaveLength(0);
	});

	it('update function updates all of the stores', () => {
		const finderStore = new FinderStore(config, services);

		finderStore.update(searchData);

		expect(finderStore.loaded).toBe(true);

		expect(finderStore.meta).toBeDefined();
		expect(finderStore.meta).toStrictEqual(searchData.meta);

		expect(finderStore.pagination.totalResults).toBe(searchData.pagination.totalResults);

		expect(finderStore.selections).toHaveLength(config.fields.reduce((count, field) => (count += field.levels.length), 0));
	});
});
