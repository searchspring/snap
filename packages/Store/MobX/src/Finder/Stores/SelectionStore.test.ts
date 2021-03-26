import { SelectionStore } from './SelectionStore';
import { StorageStore } from '../../Storage/StorageStore';

import { mockFinderController } from '../../__mocks__/mockControllers';
import { SearchData } from '../../__mocks__/SearchData';

describe('SelectionStore', () => {
	it('has a symbol species of Array', () => {
		expect(SelectionStore[Symbol.species]).toBe(Array);
	});

	describe('Hierarchy with levels', () => {
		let data, store, storage, selectionValue;

		beforeAll(() => {
			data = new SearchData({ siteId: 'ga9kq2', search: 'hierarchy' });
			storage = new StorageStore();

			mockFinderController.config = {
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
			mockFinderController.store.meta = data.meta;
			store = {
				selections: new SelectionStore(mockFinderController, data.facets, storage),
			};
		});

		it('has correct number of selections', () => {
			expect(store.selections.length).toBe(mockFinderController.config.fields[0].levels.length);
		});

		it('first selection is enabled, others disabled', () => {
			expect(store.selections[0].disabled).toBe(false);
			store.selections.forEach((selection, index) => {
				if (index === 0) {
					expect(selection.disabled).toBe(false);
				} else {
					expect(selection.disabled).toBe(true);
				}
			});
		});

		it('first selection has values', () => {
			expect(store.selections[0].values.length).toBeGreaterThan(0);
		});

		it('selection can be selected and next selection has updated values', () => {
			// mock search method to return new data
			mockFinderController.search = jest.fn(() => {
				data = new SearchData({ siteId: 'ga9kq2', search: 'hierarchy_selected' });
				store = {
					selections: new SelectionStore(mockFinderController, data.facets, storage),
				};
			});

			selectionValue = store.selections[0].values[1].value; // "Bed Racks - Tool Boxes & Liners"
			store.selections[0].select(selectionValue); // make selection
			expect(mockFinderController.search).toBeCalled();

			store.selections.forEach((selection, index) => {
				switch (index) {
					case 0:
						// first selection has selected value
						expect(store.selections[0].selected).toBe(selectionValue);
						break;
					case 1:
						// next selection is now enabled, has values, no selection
						expect(store.selections[1].disabled).toBe(false);
						expect(store.selections[1].values.length).toBeGreaterThan(0);
						expect(store.selections[1].selected).toBe('');
						break;
					default:
						// rest should be disabled
						expect(store.selections[index].disabled).toBe(true);
						break;
				}
			});
		});

		it('storage store contains correct state', () => {
			const storageData = storage.state[`ss-finder-${mockFinderController.config.id}`];
			expect(storageData).toBeDefined(); // ss-finder-finder

			const firstSelection = storageData[mockFinderController.config.fields[0].field];
			expect(firstSelection).toBeDefined(); // ss-finder-finder.ss_accessory

			const keys = Object.keys(firstSelection); // ['ss-0', 'ss-1']
			keys.forEach((key, index) => {
				expect(firstSelection[key].values.length).toBeGreaterThan(0);
				if (index === 0) {
					expect(firstSelection[key].selected).toBe(selectionValue);
				} else {
					expect(firstSelection[key].selected).toBeUndefined();
				}
			});
		});

		it('resets current level and levels above when an empty selection is made', () => {
			store.selections[0].select(store.selections[0].values[0].value);
			expect(store.selections[0].selected).toBeFalsy();

			const storageData = storage.state[`ss-finder-${mockFinderController.config.id}`];
			expect(storageData).toBeDefined(); // ss-finder-finder

			const firstSelection = storageData[mockFinderController.config.fields[0].field];
			expect(firstSelection).toBeDefined(); // ss-finder-finder.ss_accessory

			const keys = Object.keys(firstSelection); // ['ss-0', 'ss-1']
			keys.forEach((key, index) => {
				expect(firstSelection[key].selected).toBeFalsy();
				if (index == 0) {
					expect(firstSelection[key].values.length).toBeGreaterThan(0);
				} else {
					expect(firstSelection[key].values).toBe(undefined);
				}
			});
		});
	});

	describe('Hierarchy with infered levels', () => {
		let data, store, storage, selectionValue;
		beforeAll(() => {
			data = new SearchData({ siteId: 'ga9kq2', search: 'hierarchy' });
			storage = new StorageStore();

			mockFinderController.config = {
				id: 'finder',
				url: '/',
				fields: [
					{
						label: 'Accessory',
						field: 'ss_accessory',
					},
				],
			};
			mockFinderController.store.meta = data.meta;
			store = {
				selections: new SelectionStore(mockFinderController, data.facets, storage),
			};
		});

		it('is not using levels for this test', () => {
			expect(mockFinderController.config.fields[0].hasOwnProperty('levels')).toBeFalsy();
		});

		it('has a single selection initially', () => {
			expect(store.selections.length).toBe(mockFinderController.config.fields.length); // 1
			expect(store.selections[0].disabled).toBe(false);
			expect(store.selections[0].values.length).toBeGreaterThan(0);
		});

		it('selection can be selected and next selection has updated values', () => {
			// mock search method to return new data
			mockFinderController.search = jest.fn(() => {
				data = new SearchData({ siteId: 'ga9kq2', search: 'hierarchy_selected' });
				store = {
					selections: new SelectionStore(mockFinderController, data.facets, storage),
				};
			});

			selectionValue = store.selections[0].values[1].value; // "Bed Racks - Tool Boxes & Liners"
			store.selections[0].select(selectionValue); // make selection
			expect(mockFinderController.search).toBeCalled();
			expect(store.selections.length).toBe(mockFinderController.config.fields.length + 1); // 1 -> 2 selections after selection

			expect(store.selections[0].selected).toBe(selectionValue); // first selection has selection
			expect(store.selections[1].values.length).toBeGreaterThan(0); // next selection has values
			expect(store.selections[2]).toBeUndefined(); // 3rd selection should not exist
		});
	});

	describe('Non-hierarchy', () => {
		let data, store, storage, selectionValue;

		beforeAll(() => {
			data = new SearchData({ siteId: 'ga9kq2', search: 'non_hierarchy' });
			storage = new StorageStore();

			mockFinderController.config = {
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
			mockFinderController.store.meta = data.meta;
			store = {
				selections: new SelectionStore(mockFinderController, data.facets, storage),
			};
		});

		it('has correct number of selections', () => {
			expect(store.selections.length).toBe(mockFinderController.config.fields.length); // 4
		});

		it('adds an option to the values for resetting', () => {
			store.selections.forEach((selection, index) => {
				expect(selection.values.length).toBe(selection.data.length + 1);
				expect(selection.values[0]).toHaveProperty('value', '');
				expect(selection.values[0]).toHaveProperty('label', mockFinderController.config.fields[index].label);
			});
		});

		it('all selections are enabled and have values', () => {
			store.selections.forEach((selection) => {
				expect(selection.disabled).toBe(false);
				expect(selection.values.length).toBeGreaterThan(0);
			});
		});

		it('selection can be selected and next selection has updated values', () => {
			// mock search method to return new data
			mockFinderController.search = jest.fn(() => {
				data = new SearchData({ siteId: 'ga9kq2', search: 'non_hierarchy_selected' });
				store = {
					selections: new SelectionStore(mockFinderController, data.facets, storage),
				};
			});

			// save values before any selections to compare later
			const valuesBeforeSelection = store.selections.map((selection) => selection.values);

			// find a value that does not yeild 0 results in further selections
			selectionValue = store.selections[0].values.filter((value) => value.count > 1000).pop().value; // "15"

			// make selection
			store.selections[0].select(selectionValue);
			expect(mockFinderController.search).toBeCalled();
			expect(store.selections[0].selected).toBe(selectionValue);

			// save new values after selection
			const valuesAfterSelection = store.selections.map((selection) => selection.values);

			// ensure values are different
			expect(valuesBeforeSelection).not.toBe(valuesAfterSelection);
		});

		it('storage store contains correct state', () => {
			const storageData = storage.state[`ss-finder-${mockFinderController.config.id}`];
			expect(storageData).toBeDefined(); // ss-finder-finder2

			expect(Object.keys(storageData).length).toBe(mockFinderController.config.fields.length);

			Object.keys(storageData).forEach((key, index) => {
				expect(key).toBe(mockFinderController.config.fields[index].field);
			});

			const selectedField = store.selections[0].field;
			expect(storageData[selectedField].selected).toBe(selectionValue); // 15 === 15
		});

		it('resets when an empty selection is made', () => {
			store.selections[0].select(store.selections[0].values[0].value);
			expect(store.selections[0].selected).toBeFalsy();
		});
	});
});
