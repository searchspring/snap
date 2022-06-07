import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { StateStore } from './StateStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

describe('State store', () => {
	it('does not require any constructor parameters', () => {
		const stateStore = new StateStore(services);

		expect(stateStore).toBeDefined();
	});

	it('keeps state for various autocomplete purposes', () => {
		const stateStore = new StateStore(services);

		expect(stateStore).toHaveProperty('focusedInput');
		expect(stateStore).toHaveProperty('input');
		expect(stateStore.locks).toBeDefined();
		expect(stateStore.url).toBeDefined();

		expect(stateStore.input).toBe(undefined);
	});

	it('links the controller urlManager', () => {
		const stateStore = new StateStore(services);

		expect(stateStore.url).toStrictEqual(services.urlManager);
	});

	it('has locks that keep state and start unlocked', () => {
		const stateStore = new StateStore(services);

		expect(stateStore.locks.terms).toBeDefined();
		expect(stateStore.locks.facets).toBeDefined();
		expect(stateStore.locks.terms.locked).toBe(false);
		expect(stateStore.locks.facets.locked).toBe(false);
	});

	it('has locks that lock and unlock', () => {
		const stateStore = new StateStore(services);

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
		const stateStore = new StateStore(services);

		stateStore.input = query;
		stateStore.locks.terms.lock();
		stateStore.locks.facets.lock();

		expect(stateStore.input).toBe(query);
		expect(stateStore.locks.terms.locked).toBe(true);
		expect(stateStore.locks.facets.locked).toBe(true);

		stateStore.reset();

		expect(stateStore.input).toBe(undefined);
		expect(stateStore.locks.terms.locked).toBe(false);
		expect(stateStore.locks.facets.locked).toBe(false);
	});
});
