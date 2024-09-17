import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { FinderStore } from './FinderStore';
import { FinderStoreConfig } from '../types';
import { SearchResponseModel, MetaResponseModel } from '@searchspring/snapi-types';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};
const mockData = new MockData({ siteId: 'ga9kq2', search: 'hierarchy' });

const baseHierarchyConfig = {
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
const baseNonHierarchyConfig = {
	id: 'finder2',
	url: '/',
	fields: [
		{
			label: 'Wheel Size',
			field: 'custom_wheel_size',
		},
		{
			label: 'Wheel Width',
			field: 'custom_wheel_width',
		},
		{
			label: 'Wheel Bolt Pattern',
			field: 'custom_wheel_bolt_pattern',
		},
		{
			label: 'Color/Finish',
			field: 'custom_color',
		},
	],
};

const configs = [baseHierarchyConfig, baseNonHierarchyConfig];

describe('Finder Store', () => {
	let config: FinderStoreConfig;
	let searchData: {
		meta: MetaResponseModel;
		search: SearchResponseModel;
	};

	beforeEach(() => {
		config = Object.assign({}, baseHierarchyConfig);
		searchData = {
			search: mockData.search(),
			meta: mockData.meta(),
		};
	});

	it('throws if invalid services object', () => {
		expect(() => {
			// @ts-ignore
			new FinderStore(config, {});
		}).toThrow();
	});

	it('can setService', () => {
		const finderStore = new FinderStore(config, services);

		const newUrlManager = new UrlManager(new UrlTranslator()).detach();
		finderStore.setService('urlManager', newUrlManager);

		expect(finderStore.services.urlManager).toBe(newUrlManager);
	});

	it('returns correct initial state', () => {
		const finderStore = new FinderStore(config, services);

		expect(finderStore.loaded).toBe(false);

		expect(finderStore.meta).toBeDefined();
		expect(finderStore.meta?.data).toStrictEqual({});

		expect(finderStore.pagination).toBeDefined();
		expect(finderStore.pagination?.totalResults).toBeUndefined();

		expect(finderStore.selections).toBeDefined();
	});

	it('update function updates all of the stores', () => {
		const finderStore = new FinderStore(config, services);

		finderStore.update(searchData);

		expect(finderStore.loaded).toBe(true);

		expect(finderStore.meta).toBeDefined();
		expect(finderStore.meta?.data).toStrictEqual(searchData.meta);

		expect(finderStore.pagination?.totalResults).toBe(searchData.search.pagination?.totalResults);

		expect(finderStore.selections).toHaveLength(config.fields.reduce((count, field) => (count += field.levels?.length!), 0));
	});

	configs.forEach((baseConfig) => {
		const isHierarchy = 'levels' in baseConfig.fields[0];
		let config: FinderStoreConfig;
		let searchData: {
			search: SearchResponseModel;
			meta: MetaResponseModel;
		};

		describe(`Finder Store with ${isHierarchy ? 'Hierarchy' : 'Non-Hierarchy'} Selections`, () => {
			beforeEach(() => {
				config = Object.assign({}, baseConfig);
				if (isHierarchy) {
					searchData = {
						search: mockData.search(),
						meta: mockData.meta(),
					};
				} else {
					searchData = {
						search: mockData.search('non_hierarchy'),
						meta: mockData.meta(),
					};
				}
			});

			it('can persist selections', () => {
				config = {
					...config,
					persist: {
						enabled: true,
						lockSelections: false,
						expiration: 0,
					},
				};
				const finderStore = new FinderStore(config, services);
				finderStore.update(searchData);

				expect(finderStore.config.persist?.enabled).toBe(true);
				expect(finderStore.loaded).toBe(true);
				expect(finderStore.persisted).toBe(false);

				const selections = finderStore.selections!;
				const valueToSelect = selections[0].values.filter((value) => value.count! > 10)[0].value;
				selections[0].select(valueToSelect);
				expect(selections[0].selected).toBe(valueToSelect);

				finderStore.save();

				expect(finderStore.persistedStorage?.get('config')).toStrictEqual(finderStore.config);
				expect(finderStore.persistedStorage?.get('data')).toBeDefined();
				expect(finderStore.persistedStorage?.get('date')).toBeDefined();
				expect(finderStore.persistedStorage?.get('selections').length).toBeGreaterThan(0);

				const finderStore2 = new FinderStore(config, services);
				finderStore2.loadPersisted();

				expect(finderStore2.persisted).toBe(true);
				expect(finderStore2.selections && finderStore2.selections[0].selected).toBe(valueToSelect);

				expect(finderStore2.config.persist?.lockSelections).toBe(false);
				finderStore2.selections?.forEach((selection) => {
					expect(selection.disabled).toBe(false);
				});
			});

			it('has locked persisted selections due to lockSelections', () => {
				config = {
					...config,
					persist: {
						enabled: true,
						lockSelections: true,
						expiration: 0,
					},
				};
				const finderStore = new FinderStore(config, services);
				finderStore.update(searchData);

				expect(finderStore.config.persist?.enabled).toBe(true);
				expect(finderStore.loaded).toBe(true);
				expect(finderStore.persisted).toBe(false);
				expect(finderStore.config.persist?.lockSelections).toBe(true);

				const selections = finderStore.selections!;
				const valueToSelect = selections[0].values.filter((value) => value.count! > 10)[0].value;
				selections[0].select(valueToSelect);
				expect(selections[0].selected).toBe(valueToSelect);

				finderStore.save();

				const finderStore2 = new FinderStore(config, services);
				finderStore2.loadPersisted();

				expect(finderStore2.persisted).toBe(true);
				expect(finderStore2.selections && finderStore2.selections[0].selected).toBe(valueToSelect);

				expect(finderStore2.config.persist?.lockSelections).toBe(true);
				finderStore2.selections?.forEach((selection) => {
					expect(selection.disabled).toBe(true);
				});
			});

			it('can reset persisted selections after expiration', async () => {
				config = {
					...config,
					persist: {
						enabled: true,
						lockSelections: true,
						expiration: 100, // 100ms
					},
				};
				const finderStore = new FinderStore(config, services);
				finderStore.update(searchData);

				expect(finderStore.config.persist?.enabled).toBe(true);
				expect(finderStore.loaded).toBe(true);
				expect(finderStore.persisted).toBe(false);
				expect(finderStore.config.persist?.lockSelections).toBe(true);

				const selections = finderStore.selections!;
				const valueToSelect = selections[0].values.filter((value) => value.count! > 10)[0].value;
				selections[0].select(valueToSelect);
				expect(selections[0].selected).toBe(valueToSelect);

				finderStore.save();

				// should not have expired yet
				const finderStore2 = new FinderStore(config, services);
				finderStore2.loadPersisted();
				expect(finderStore2.persisted).toBe(true);

				// should be expired now
				await new Promise((resolve) => setTimeout(resolve, config.persist?.expiration! + 10));

				const finderStore3 = new FinderStore(config, services);
				const spy = jest.spyOn(finderStore3, 'reset');
				finderStore3.loadPersisted();

				expect(finderStore3.persisted).toBe(false);
				expect(spy).toHaveBeenCalled();

				spy.mockClear();
			});

			it('can reset persisted selections if config has changed', () => {
				config = {
					...config,
					persist: {
						enabled: true,
						lockSelections: true,
						expiration: 0,
					},
				};
				const finderStore = new FinderStore(config, services);
				finderStore.update(searchData);

				const selections = finderStore.selections!;
				const valueToSelect = selections[0].values.filter((value) => value.count! > 10)[0].value;
				selections[0].select(valueToSelect);
				expect(selections[0].selected).toBe(valueToSelect);

				finderStore.save();

				config = {
					...config,
					has: 'changed config',
				};

				// should not persist due to config mismatch
				const finderStore2 = new FinderStore(config, services);
				finderStore2.loadPersisted();
				expect(finderStore2.persisted).toBe(false);
				expect(finderStore2.selections?.length).toBe(0);
			});

			it('it will NOT reset persisted selections if something in the config plugins has changed', () => {
				const testPlugin = () => {};

				config = {
					...config,
					plugins: [[testPlugin, Math.random()]],
					persist: {
						enabled: true,
						lockSelections: true,
						expiration: 0,
					},
				};
				const finderStore = new FinderStore(config, services);
				finderStore.update(searchData);

				const selections = finderStore.selections!;
				const valueToSelect = selections[0].values.filter((value) => value.count! > 10)[0].value;
				selections[0].select(valueToSelect);
				expect(selections[0].selected).toBe(valueToSelect);

				finderStore.save();

				config = {
					...config,
					plugins: [[testPlugin, Math.random()]],
					persist: {
						enabled: true,
						lockSelections: true,
						expiration: 0,
					},
				};

				// should not persist due to config mismatch
				const finderStore2 = new FinderStore(config, services);
				finderStore2.loadPersisted();
				expect(finderStore2.persisted).toBe(true);
			});

			it('it will NOT reset persisted selections if something in the config middleware has changed', () => {
				config = {
					...config,
					middleware: {
						onInit: () => {},
					},
					persist: {
						enabled: true,
						lockSelections: true,
						expiration: 0,
					},
				};
				const finderStore = new FinderStore(config, services);
				finderStore.update(searchData);

				const selections = finderStore.selections!;
				const valueToSelect = selections[0].values.filter((value) => value.count! > 10)[0].value;
				selections[0].select(valueToSelect);
				expect(selections[0].selected).toBe(valueToSelect);

				finderStore.save();

				config = {
					...config,
					middleware: {
						afterSearch: () => {},
					},
					persist: {
						enabled: true,
						lockSelections: true,
						expiration: 0,
					},
				};

				// should not persist due to config mismatch
				const finderStore2 = new FinderStore(config, services);
				finderStore2.loadPersisted();
				expect(finderStore2.persisted).toBe(true);
			});
		});
	});
});
