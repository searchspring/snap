import { StateStore } from './StateStore';

import { mockAutocompleteController } from '../../__mocks__/mockControllers';

describe('State store', () => {
	it('does not require any constructor parameters', () => {
		const stateStore = new StateStore();

		expect(stateStore).toBeDefined();
	});

	it('keeps state for various autocomplete purposes', () => {
		const stateStore = new StateStore();

		expect(stateStore).toHaveProperty('focusedInput');
		expect(stateStore).toHaveProperty('input');
		expect(stateStore.locks).toBeDefined();
		expect(stateStore.url).toBeUndefined();

		expect(stateStore.input).toBe('');
	});

	it('links the controller urlManager', () => {
		const stateStore = new StateStore();

		stateStore.link(mockAutocompleteController);
		expect(stateStore.url).toStrictEqual(mockAutocompleteController.urlManager);
	});

	it('has locks that keep state and start unlocked', () => {
		const stateStore = new StateStore();
		stateStore.link(mockAutocompleteController);

		expect(stateStore.locks.terms).toBeDefined();
		expect(stateStore.locks.facets).toBeDefined();
		expect(stateStore.locks.terms.locked).toBe(false);
		expect(stateStore.locks.facets.locked).toBe(false);
	});

	it('has locks that lock and unlock', () => {
		const stateStore = new StateStore();
		stateStore.link(mockAutocompleteController);

		expect(stateStore.locks.terms.locked).toBe(false);
		expect(stateStore.locks.facets.locked).toBe(false);

		stateStore.locks.terms.lock();
		stateStore.locks.facets.lock();

		expect(stateStore.locks.terms.locked).toBe(true);
		expect(stateStore.locks.facets.locked).toBe(true);

		stateStore.locks.terms.unlock();
		stateStore.locks.facets.unlock();

		expect(stateStore.locks.terms.locked).toBe(false);
		expect(stateStore.locks.facets.locked).toBe(false);
	});

	it('has a reset function', () => {
		const query = 'query';
		const stateStore = new StateStore();
		stateStore.link(mockAutocompleteController);

		stateStore.input = query;
		stateStore.locks.terms.lock();
		stateStore.locks.facets.lock();

		expect(stateStore.input).toBe(query);
		expect(stateStore.locks.terms.locked).toBe(true);
		expect(stateStore.locks.facets.locked).toBe(true);

		stateStore.reset();

		expect(stateStore.input).toBe('');
		expect(stateStore.locks.terms.locked).toBe(false);
		expect(stateStore.locks.facets.locked).toBe(false);
	});
});
