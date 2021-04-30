import { mergeParams } from './mergeParams';

describe('param merger', () => {
	it('merges params as array values', () => {
		const params = mergeParams({ foo: 'bar' }, { bar: 'baz' });

		expect(params).toEqual({ foo: ['bar'], bar: ['baz'] });
	});

	it('merges duplicates', () => {
		const params = mergeParams({ foo: ['baz', 'fromfoo'] }, { foo: 'bar' });

		expect(params).toEqual({ foo: ['bar', 'baz', 'fromfoo'] });
	});
});
