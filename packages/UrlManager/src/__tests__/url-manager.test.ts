import UrlManager from '../UrlManager';
import QueryStringTranslator from '../translators/query-string';
import { UrlState, UrlTranslator } from '../types';

let url = '';

class MockTranslator implements UrlTranslator {
	constructor(private config?: Record<string, unknown>) {}

	getConfig() {
		return this.config || {};
	}

	getCurrentUrl() {
		return url;
	}

	serialize(state: UrlState): string {
		return '#' + JSON.stringify(state);
	}

	deserialize(url: string): UrlState {
		return JSON.parse(url.replace(/^#/, '') || '{}');
	}

	go(_url: string) {
		url = _url;
	}
}

class MockQueryStringTranslator extends QueryStringTranslator {
	getCurrentUrl() {
		return url;
	}

	go(_url: string) {
		url = _url;
	}
}

describe('UrlManager', () => {
	beforeEach(() => (url = ''));

	it('set and merge make copies', () => {
		const urlManager = new UrlManager(new MockTranslator());

		const m2 = urlManager.set({ foo: 1 });
		const m3 = urlManager.merge({ bar: 1 });

		expect(urlManager).not.toBe(m2);
		expect(urlManager).not.toBe(m3);
		expect(m2).not.toBe(m3);
	});

	it('sets initial URL', () => {
		url = '{ "foo": { "bar": ["one", "two" ] } }';

		const urlManager = new UrlManager(new MockTranslator());

		expect(urlManager.state).toEqual({ foo: { bar: ['one', 'two'] } });
	});

	it('merges from base URL without modifying original', () => {
		url = '{ "foo": { "bar": ["one", "two" ] }, "arr": [ 0, 1 ] }';

		const urlManager = new UrlManager(new MockTranslator());
		const urlManagerModified = urlManager
			.merge({ foo: { baz: 2 } })
			.merge('color', 'red')
			.merge('arr', 2)
			.merge('arr', 0);

		expect(urlManager.state).toEqual({ foo: { bar: ['one', 'two'] }, arr: [0, 1] });
		expect(urlManagerModified.state).toEqual({
			foo: { bar: ['one', 'two'], baz: 2 },
			color: 'red',
			arr: [0, 1, 2, 0],
		});
	});

	it('merges multiple', () => {
		const urlManager = new UrlManager(new MockTranslator());

		const merged = urlManager.merge('color', 'blue').merge('color', 'red');

		expect(merged.state).toEqual({ color: ['blue', 'red'] });
	});

	it('expects filters to be arrays and can set them that way', () => {
		const urlManager = new UrlManager(new MockTranslator());

		const setAsObject = urlManager.set({ filter: { color: ['blue', 'green', 'red'] } });
		expect(setAsObject.state).toEqual({ filter: { color: ['blue', 'green', 'red'] } });

		const setAsArraySingle = urlManager.set(['filter', 'color'], ['red']);
		expect(setAsArraySingle.state).toEqual({ filter: { color: ['red'] } });

		const setAsArrayMultiple = urlManager.set(['filter', 'color'], ['blue', 'green', 'red']);
		expect(setAsArrayMultiple.state).toEqual({ filter: { color: ['blue', 'green', 'red'] } });

		const setAsString = urlManager.set('filter.color', ['blue', 'green', 'red']);
		expect(setAsString.state).toEqual({ filter: { color: ['blue', 'green', 'red'] } });
	});

	it('expects filters to be arrays and merges them that way', () => {
		const urlManager = new UrlManager(new MockTranslator());

		const mergeAsObject = urlManager.merge({ filter: { color: ['blue', 'green', 'red'] } });
		expect(mergeAsObject.state).toEqual({ filter: { color: ['blue', 'green', 'red'] } });
		const remergeAsObject = mergeAsObject.merge({ filter: { color: ['yellow'] } });
		expect(remergeAsObject.state).toEqual({ filter: { color: ['blue', 'green', 'red', 'yellow'] } });
		const remergeAsObjectAgain = remergeAsObject.merge('filter.color', ['yellow']);
		expect(remergeAsObjectAgain.state).toEqual({ filter: { color: ['blue', 'green', 'red', 'yellow', 'yellow'] } });

		const mergeAsArraySingle = urlManager.merge(['filter', 'color'], ['red']);
		expect(mergeAsArraySingle.state).toEqual({ filter: { color: ['red'] } });

		const mergeAsArrayMultiple = urlManager.merge(['filter', 'color'], ['blue', 'green', 'red']);
		expect(mergeAsArrayMultiple.state).toEqual({ filter: { color: ['blue', 'green', 'red'] } });

		const mergeAsString = urlManager.merge('filter.color', ['blue', 'green', 'red']);
		expect(mergeAsString.state).toEqual({ filter: { color: ['blue', 'green', 'red'] } });
	});

	it('expects filters to be arrays and removes them that way', () => {
		const urlManager = new UrlManager(new MockTranslator());

		const setAsObject = urlManager.set({ filter: { color: ['blue', 'green', 'red'] } });
		expect(setAsObject.state).toEqual({ filter: { color: ['blue', 'green', 'red'] } });

		const fullyRemovedAsArray = setAsObject.remove(['filter', 'color']);
		expect(fullyRemovedAsArray.state).toEqual({ filter: {} });

		const fullyRemovedAsString = setAsObject.remove('filter.color');
		expect(fullyRemovedAsString.state).toEqual({ filter: {} });

		// doesn't remove because path doesn't exist
		const removeSingleAsArray = setAsObject.remove(['filter', 'color', 'red']);
		expect(removeSingleAsArray.state).toEqual({ filter: { color: ['blue', 'green', 'red'] } });

		// should this be supported?
		const removeAsArrayString = setAsObject.remove(['filter', 'color'], 'red');
		expect(removeAsArrayString.state).toEqual({ filter: { color: ['blue', 'green'] } });

		const removeAsArray = setAsObject.remove(['filter', 'color'], ['red']);
		expect(removeAsArray.state).toEqual({ filter: { color: ['blue', 'green'] } });

		const removeMultipleAsArray = setAsObject.remove(['filter', 'color'], ['red', 'blue']);
		expect(removeMultipleAsArray.state).toEqual({ filter: { color: ['green'] } });

		const removeSingleAsString = setAsObject.remove('filter.color', ['red']);
		expect(removeSingleAsString.state).toEqual({ filter: { color: ['blue', 'green'] } });

		const removeMutlipleAsString = setAsObject.remove('filter.color', ['red', 'blue']);
		expect(removeMutlipleAsString.state).toEqual({ filter: { color: ['green'] } });

		// not sure about this one... how should it handle this?
		const removeAll = setAsObject.remove('filter.color', ['red', 'blue', 'green']);
		expect(removeAll.state).toEqual({ filter: {} });
	});

	it('sets from base URL without modifying original', () => {
		url = '{ "foo": { "bar": ["one", "two" ] }, "v": [ 1 ] }';

		const urlManager = new UrlManager(new MockTranslator()).set({
			extraParam: 'extraValue',
		});
		const urlManagerModified = urlManager.set({ foo: { baz: 2 }, v: [2] });

		expect(urlManager.state).toEqual({
			extraParam: 'extraValue',
		});
		expect(urlManagerModified.state).toEqual({
			foo: { baz: 2 },
			v: [2],
		});
	});

	it('set function overrides other values at path (all for empty path)', () => {
		url = '{ "foo": { "bar": { "baz": ["one", "two" ] } }, "extraUrlParam": 7 }';

		const urlManager = new UrlManager(new MockTranslator());

		expect(urlManager.set('foo.bar', { newValue: 1 }).state).toEqual({
			foo: {
				bar: {
					newValue: 1,
				},
			},
			extraUrlParam: 7,
		});

		expect(urlManager.set('foo', { newValue: 2 }).state).toEqual({
			foo: {
				newValue: 2,
			},
			extraUrlParam: 7,
		});

		expect(urlManager.set({ newValue: 1 }).state).toEqual({ newValue: 1 });
	});

	it('calls translator go fn', () => {
		url = '{ "foo": { "bar": ["one", "two" ] } }';

		const urlManager = new UrlManager(new MockTranslator()).set({
			extraParam: 'extraValue',
		});

		urlManager.merge({ v1: 'v1_v' }).go();

		expect(url).toBe('#{"extraParam":"extraValue","v1":"v1_v"}');
	});

	it('auto-updates from watcher pool on URL change', () => {
		const urlManagerBase = new UrlManager(new MockTranslator());

		const urlManager1 = urlManagerBase.merge({ stuff: 'works' });
		const urlManager2 = urlManagerBase.merge({ other: 'param' });

		expect(urlManager2.state).toEqual({ other: 'param' });

		urlManager1.go();

		expect(urlManager1.state).toEqual({ stuff: 'works' });
		expect(urlManager2.state).toEqual({ other: 'param', stuff: 'works' });
	});

	it('can set with optional path as string or array', () => {
		const urlManagerBase = new UrlManager(new MockTranslator()).set({
			key1: { foo: { bar: 1 } },
			key2: ['some', 'array', 'values'],
		});

		const modified1 = urlManagerBase.set('key1.foo.bar', 'now a string');
		const modified2 = urlManagerBase.set('key1', 'a different string');
		const modified3 = urlManagerBase.set(['key1', 'foo'], 17);

		expect(modified1.state).toEqual({
			key1: { foo: { bar: 'now a string' } },
			key2: ['some', 'array', 'values'],
		});

		expect(modified2.state).toEqual({
			key1: 'a different string',
			key2: ['some', 'array', 'values'],
		});

		expect(modified3.state).toEqual({
			key1: { foo: 17 },
			key2: ['some', 'array', 'values'],
		});
	});

	it('can merge with optional path as string or array', () => {
		const urlManagerBase = new UrlManager(new MockTranslator()).set({
			key1: { foo: { bar: 1 } },
			key2: ['some', 'array', 'values'],
		});

		const modified1 = urlManagerBase.merge('key1.foo', {
			arr: ['from', 'nested', 'object'],
		});
		const modified2 = urlManagerBase.merge('key2', 'another value');

		expect(modified1.state).toEqual({
			key1: { foo: { bar: 1, arr: ['from', 'nested', 'object'] } },
			key2: ['some', 'array', 'values'],
		});

		expect(modified2.state).toEqual({
			key1: { foo: { bar: 1 } },
			key2: ['some', 'array', 'values', 'another value'],
		});
	});

	it('can remove values with path as array or string', () => {
		url = 'key1.foo.bar=one&key1.foo.bar=two&key1.foo.bar=three&v=huh';

		const urlManagerBase = new UrlManager(new MockQueryStringTranslator()).merge({
			some: {
				deeper: {
					value: 'the_val',
				},
			},
		});

		const withoutKey1str = urlManagerBase.remove('v').remove('key1.foo.bar').remove('some.deeper');

		const withoutKey1arr = urlManagerBase.remove('v').remove(['key1', 'foo']).remove(['some', 'deeper', 'value']);

		expect(withoutKey1str.state).toEqual({
			key1: { foo: {} },
			some: {},
		});

		expect(withoutKey1arr.state).toEqual({
			key1: {},
			some: {
				deeper: {},
			},
		});

		const arrValRemoved = urlManagerBase.remove('v').remove(['key1', 'foo', 'bar', 'two']);

		expect(arrValRemoved.state).toEqual({
			key1: { foo: { bar: ['one', 'three'] } },
			some: {
				deeper: {
					value: 'the_val',
				},
			},
		});

		expect(withoutKey1str.merge('some', { n: 'v' }).href).toBe('?some.n=v');
	});

	it('subscriber fn is called and passed [next,prev]', () => {
		const urlManager = new UrlManager(new MockTranslator()).merge({
			original: { value: 5 },
		});

		const cb = jest.fn((next, prev) => {
			expect(prev).toEqual({ original: { value: 5 } });
			expect(next).toEqual({
				foo: 'bar',
				other: 'value wt',
				original: { value: 5 },
			});
		});

		urlManager.subscribe((next, prev) => cb(next, prev));

		urlManager.set({ foo: 'bar' }).merge('other', 'value wt').go();

		expect(cb).toBeCalled();
	});

	it('subscriber fn still passes in [next,prev] if value has not changed', () => {
		let urlManager = new UrlManager(new MockTranslator()).merge({
			same: 'same',
			notHere: 'notHere',
		});

		const cb = jest.fn((next, prev) => {
			expect(prev).toEqual({ same: 'same', baz: 'boz', foo: 'bar', was: 'set' });
			expect(next).toEqual({ same: 'same', baz: 'boz', foo: 'bar', was: 'set' });
		});

		urlManager = urlManager.merge({ baz: 'boz' }).merge({ foo: 'bar' }).remove('notHere').set('was', 'set');

		urlManager.go();

		urlManager.subscribe((next, prev) => cb(next, prev));

		urlManager.go();

		expect(cb).toBeCalled();
	});

	it('accepts optional linker fn that is called via link getter', () => {
		let urlManager: UrlManager;

		const linker = jest.fn((_urlManager: UrlManager) => {
			expect(_urlManager).toBe(urlManager);

			return {
				val: 'this is the correct linker fn',
			};
		});

		urlManager = new UrlManager(new MockTranslator(), linker);

		expect(urlManager.link).toEqual({
			val: 'this is the correct linker fn',
		});

		expect(linker).toBeCalled();
	});

	it('subscriber fn still passes in [next,prev] if the url has updated since last state merge', () => {
		let urlManager = new UrlManager(new MockTranslator());

		urlManager.set({ query: 'red' }).go();

		const cb = jest.fn((next, prev) => {
			expect(prev).toEqual({ query: 'red' });
			expect(next).toEqual({ query: 'red' });
		});

		urlManager.subscribe((next, prev) => cb(next, prev));

		urlManager.set({ query: 'red' }).go();

		expect(cb).toBeCalled();
	});

	it('detach function detaches from current URL', () => {
		url = '{ "foo": { "bar": ["one", "two" ] } }';

		let urlManager = new UrlManager(new MockTranslator()).merge({ merged: 'value' });

		urlManager = urlManager.detach();

		url = '{ "foo": { "bar": ["one", "two" ] }, "extra": "yes" }';

		expect(urlManager.state).toEqual({ foo: { bar: ['one', 'two'] }, merged: 'value' });

		urlManager = urlManager.merge('vbefore', '1').detach(true).merge('vafter', '2');

		expect(urlManager.state).toEqual({ merged: 'value', vbefore: '1', vafter: '2' });
	});

	it('reset resets all', () => {
		url = '{ "foo": { "bar": ["one", "two" ] } }';

		let urlManager = new UrlManager(new MockTranslator()).merge({ merged: 'value' });

		expect(urlManager.reset().state).toEqual({});
		expect(urlManager.reset().href).toBe('#{}');
	});

	it('can be used with alternate config', () => {
		url = '{ "foo": { "bar": ["one", "two" ] } }';

		let urlManager = new UrlManager(new MockTranslator({ k1: 'v1' }));

		let urlManager2 = urlManager.withConfig({ foo: 'bar' });

		let urlManager3 = urlManager2.withConfig((config) => {
			return {
				...config,
				baz: 'bo',
			};
		});

		expect(urlManager.getTranslatorConfig()).toEqual({ k1: 'v1' });
		expect(urlManager2.getTranslatorConfig()).toEqual({ foo: 'bar' });
		expect(urlManager3.getTranslatorConfig()).toEqual({ foo: 'bar', baz: 'bo' });

		expect(urlManager.state).toEqual(urlManager2.state);
		expect(urlManager2.state).toEqual(urlManager3.state);
	});
});
