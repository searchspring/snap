import { UrlManager } from './UrlManager';
import { UrlState, Translator } from '../types';

let url = '';

class MockTranslator implements Translator {
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

describe('UrlManager', () => {
	beforeEach(() => (url = ''));

	it('sets initial URL', () => {
		url = '{ "foo": { "bar": ["one", "two" ] } }';

		const urlManager = new UrlManager(new MockTranslator());

		expect(urlManager.state).toEqual({ foo: { bar: ['one', 'two'] } });
	});

	it('makes copies', () => {
		url = '{ "foo": 1 }';
		const urlState = new UrlManager(new MockTranslator());

		const setState = urlState.set({ foo: 1 });
		const mergeState = urlState.merge({ foo: 1 });

		expect(urlState.state).toStrictEqual(setState.state);
		expect(urlState.state).toStrictEqual(mergeState.state);
		expect(urlState.state).toStrictEqual(urlState.state);

		expect(urlState).not.toBe(setState);
		expect(urlState).not.toBe(mergeState);
		expect(setState).not.toBe(mergeState);
	});

	it('calls translator go fn', () => {
		url = '{ "foo": { "bar": ["one", "two" ] } }';

		const urlManager = new UrlManager(new MockTranslator()).set({
			extraParam: 'extraValue',
		});

		urlManager.go();

		expect(url).toBe('#{"extraParam":"extraValue"}');

		urlManager.merge({ v1: 'v1_v' }).go();

		expect(url).toBe('#{"extraParam":"extraValue","v1":"v1_v"}');
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

		urlManager = new UrlManager(new MockTranslator(), linker);

		expect(urlManager.link).toEqual({
			val: 'this is the correct linker fn',
		});

		expect(linker).toHaveBeenCalledTimes(2);
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

		const urlManager = new UrlManager(new MockTranslator()).merge({ merged: 'value' });

		expect(urlManager.reset().state).toEqual({});
		expect(urlManager.reset().href).toBe('#{}');
	});

	it('can be used with alternate translator config', () => {
		url = '{ "foo": { "bar": ["one", "two" ] } }';

		const urlManager = new UrlManager(new MockTranslator({ k1: 'v1' }));

		const urlManager2 = urlManager.withConfig({ foo: 'bar' });

		const urlManager3 = urlManager2.withConfig((config) => {
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

	describe('subscribe', () => {
		it('subscriber fn is called and passed [next,prev]', () => {
			const urlManager = new UrlManager(new MockTranslator()).merge({
				original: { value: 5 },
			});

			const cb = jest.fn((prev, next) => {
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

		it('passes in [next,prev] if value has not changed', () => {
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

		it('passes in [next,prev] if the url has updated since last state merge', () => {
			const urlManager = new UrlManager(new MockTranslator());

			urlManager.set({ query: 'red' }).go();

			const cb = jest.fn((next, prev) => {
				expect(prev).toEqual({ query: 'red' });
				expect(next).toEqual({ query: 'red' });
			});

			urlManager.subscribe((next, prev) => cb(next, prev));

			urlManager.set({ query: 'red' }).go();

			expect(cb).toBeCalled();
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
	});

	describe('set transform', () => {
		it('sets from base URL without modifying original', () => {
			url = '{ "foo": { "bar": ["one", "two" ] }, "v": [ 1 ] }';

			const urlManager = new UrlManager(new MockTranslator());

			const urlManagerExtra = urlManager.set({ extraParam: 'extraValue' });
			const urlManagerModified = urlManager.set({ foo: { baz: 2 }, v: [2] });

			expect(urlManager.state).toEqual({
				foo: {
					bar: ['one', 'two'],
				},
				v: [1],
			});

			expect(urlManagerExtra.state).toEqual({
				extraParam: 'extraValue',
			});

			expect(urlManagerModified.state).toEqual({
				foo: { baz: 2 },
				v: [2],
			});
		});

		it('overrides other values at path (all for empty path)', () => {
			url = '{ "foo": { "bar": { "baz": ["one", "two" ] } }, "extraUrlParam": 7 }';

			const urlManager = new UrlManager(new MockTranslator());

			expect(urlManager.set('foo.bar.baz', { newValue: 1 }).state).toEqual({
				foo: {
					bar: {
						baz: {
							newValue: 1,
						},
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

			expect(urlManager.set({}).state).toEqual({});
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

		it('can set array of values of different types', () => {
			const urlManager = new UrlManager(new MockTranslator());

			const setArrayOfStrings = urlManager.set({ filter: { count: ['uno', 'dos', 'tres'] } });
			expect(setArrayOfStrings.state).toEqual({ filter: { count: ['uno', 'dos', 'tres'] } });

			const setArrayOfNumbers = urlManager.set({ filter: { count: [1, 2, 3] } });
			expect(setArrayOfNumbers.state).toEqual({ filter: { count: [1, 2, 3] } });

			const setArrayOfObjects = urlManager.set({
				filter: {
					count: [
						{ string: 'uno', number: 1 },
						{ string: 'dos', number: 2 },
						{ string: 'tres', number: 3 },
					],
				},
			});
			expect(setArrayOfObjects.state).toEqual({
				filter: {
					count: [
						{ string: 'uno', number: 1 },
						{ string: 'dos', number: 2 },
						{ string: 'tres', number: 3 },
					],
				},
			});
		});

		it('supports various value types (what you set is what you get)', () => {
			const booleanType = new UrlManager(new MockTranslator()).set('filter.boolean', true);
			expect(booleanType.state).toStrictEqual({ filter: { boolean: true } });

			const booleanArrayType = new UrlManager(new MockTranslator()).set('filter.boolean', [true, false]);
			expect(booleanArrayType.state).toStrictEqual({ filter: { boolean: [true, false] } });

			const objectType = new UrlManager(new MockTranslator()).set('filter.object', { low: 0, high: 10 });
			expect(objectType.state).toStrictEqual({ filter: { object: { low: 0, high: 10 } } });

			const ArrayArrayType = new UrlManager(new MockTranslator()).set('filter.array', [
				['uno', 'dos', 'uno'],
				[1, 2],
			]);
			expect(ArrayArrayType.state).toStrictEqual({
				filter: {
					array: [
						['uno', 'dos', 'uno'],
						[1, 2],
					],
				},
			});
		});

		it('removes duplicates when set', () => {
			const duplicateSet = new UrlManager(new MockTranslator()).set('filter.boolean', [true, false, true]);
			expect(duplicateSet.state).toStrictEqual({ filter: { boolean: [true, false] } });
		});
	});

	describe('merge transform', () => {
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

		it('merges from base URL without modifying original', () => {
			url = '{ "foo": { "bar": ["one", "two" ] }, "arr": [ 0, 1 ] }';

			const urlManager = new UrlManager(new MockTranslator());
			expect(urlManager.state).toEqual({ foo: { bar: ['one', 'two'] }, arr: [0, 1] });

			const urlManagerModified = urlManager
				.merge({ foo: { baz: 2 } })
				.merge('color', 'red')
				.merge('arr', [2])
				.merge('arr', 0);
			expect(urlManagerModified.state).toEqual({
				foo: { bar: ['one', 'two'], baz: 2 },
				color: 'red',
				arr: [0, 1, 2],
			});
		});

		it('merges single values into array', () => {
			url = '{ "color": ["red"] }';
			const mergeIntoArray = new UrlManager(new MockTranslator());
			const merged = mergeIntoArray.merge('color', 'blue');
			expect(merged.state).toEqual({ color: ['red', 'blue'] });

			// TODO: make this work?
			// url = '{ "color": "red" }';
			// const mergeSingle = new UrlManager(new MockTranslator());
			// const mergedSingle = mergeSingle.merge('color', 'blue');
			// expect(mergedSingle.state).toEqual({ color: ['red', 'blue'] });

			url = '{ "color": ["red"] }';
			const mergeArray = new UrlManager(new MockTranslator());
			const mergedSingleIntoArray = mergeArray.merge('color', 'blue');
			expect(mergedSingleIntoArray.state).toEqual({ color: ['red', 'blue'] });
		});

		it('does not merge duplicates', () => {
			const urlManager = new UrlManager(new MockTranslator());

			const merge = urlManager.merge('filter.color', 'blue');

			expect(merge.state).toEqual({ filter: { color: 'blue' } });
			const mergeAgain = merge.merge('filter.color', 'blue');
			expect(mergeAgain.state).toEqual({ filter: { color: 'blue' } });
			const mergeAgainArray = merge.merge('filter.color', ['blue']);
			expect(mergeAgainArray.state).toEqual({ filter: { color: 'blue' } });
			const mergeAgainArrayMultiples = merge.merge('filter.color', ['blue', 'red', 'blue', 'blue']);
			expect(mergeAgainArrayMultiples.state).toEqual({ filter: { color: ['blue', 'red'] } });

			const mergeObject = urlManager.merge('filter.price', { low: 0, high: 10 });
			expect(mergeObject.state).toStrictEqual({ filter: { price: { low: 0, high: 10 } } });
			const mergeObjectWithArray = mergeObject.merge('filter.price', [
				{ low: 0, high: 10 },
				{ low: 0, high: 10 },
				{ low: 10, high: 20 },
				{ low: 10, high: 20 },
			]);
			expect(mergeObjectWithArray.state).toStrictEqual({
				filter: {
					price: [
						{ low: 0, high: 10 },
						{ low: 10, high: 20 },
					],
				},
			});
		});
	});

	describe('remove transform', () => {
		it('removes from base URL without modifying original', () => {
			url = '{ "foo": { "bar": ["one", "two" ] }, "arr": [ 0, 1 ] }';

			const urlManager = new UrlManager(new MockTranslator());
			expect(urlManager.state).toEqual({ foo: { bar: ['one', 'two'] }, arr: [0, 1] });

			const urlManagerModifiedValue = urlManager.remove('arr', 0);
			expect(urlManagerModifiedValue.state).toEqual({
				foo: { bar: ['one', 'two'] },
				arr: [1],
			});

			const urlManagerModified = urlManager.remove('foo.bar');
			expect(urlManagerModified.state).toEqual({
				foo: {},
				arr: [0, 1],
			});

			const urlManagerModifiedAgain = urlManager.remove('foo');
			expect(urlManagerModifiedAgain.state).toEqual({
				arr: [0, 1],
			});
		});

		it('removes from internal state', () => {
			const urlManagerBase = new UrlManager(new MockTranslator()).set({
				foo: { bar: ['one', 'two'] },
				arr: [0, 1, 2],
			});

			expect(urlManagerBase.state).toEqual({
				foo: { bar: ['one', 'two'] },
				arr: [0, 1, 2],
			});

			const urlManagerModified = urlManagerBase.remove('foo.bar', 'one');
			expect(urlManagerModified.state).toEqual({
				foo: { bar: ['two'] },
				arr: [0, 1, 2],
			});

			const urlManagerModifiedSingleValue = urlManagerBase.remove('arr', 0);
			expect(urlManagerModifiedSingleValue.state).toEqual({
				foo: { bar: ['one', 'two'] },
				arr: [1, 2],
			});

			const urlManagerModifiedMultiValue = urlManagerBase.remove('arr', [0, 1]);
			expect(urlManagerModifiedMultiValue.state).toEqual({
				foo: { bar: ['one', 'two'] },
				arr: [2],
			});
		});

		it('removes values from merged state', () => {
			url = '{ "key1": { "foo": { "bar": ["one", "two", "three"] } }, "v": ["huh"] }';

			const urlManagerBase = new UrlManager(new MockTranslator()).merge({
				some: {
					deeper: {
						value: 'the_val',
					},
				},
			});

			const withoutKey1str = urlManagerBase.remove('v').remove('key1.foo.bar').remove('some.deeper');
			expect(withoutKey1str.state).toEqual({
				key1: { foo: {} },
				some: {},
			});

			const withoutKey1arr = urlManagerBase.remove('v').remove(['key1', 'foo']).remove(['some', 'deeper', 'value']);
			expect(withoutKey1arr.state).toEqual({
				key1: {},
				some: {
					deeper: {},
				},
			});

			const arrValRemoved = urlManagerBase.remove(['key1', 'foo', 'bar'], ['two']);
			expect(arrValRemoved.state).toEqual({
				key1: { foo: { bar: ['one', 'three'] } },
				some: {
					deeper: {
						value: 'the_val',
					},
				},
				v: ['huh'],
			});
		});
	});
});
