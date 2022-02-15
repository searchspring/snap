import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { TermStore } from './TermStore';
import { StateStore } from './StateStore';

const mockResetTrending = jest.fn();

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const mockData = new MockData();

const rootState = new StateStore(services);

describe('Term Store', () => {
	it('has a symbol species of Array', () => {
		expect(TermStore[Symbol.species]).toBe(Array);
	});

	it('is empty when it is passed undefined', () => {
		const termStore = new TermStore(services, undefined, undefined, mockResetTrending, rootState);

		expect(termStore).toEqual([]);
	});

	it('is empty when it is passed no data', () => {
		const termStore = new TermStore(services, {}, {}, mockResetTrending, rootState);

		expect(termStore).toEqual([]);
	});

	it('contains the correct terms', () => {
		const searchData = mockData.autocompleteMeta();
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(services, autocomplete, searchData.pagination, mockResetTrending, rootState);

		const expected = [autocomplete.suggested.text, ...autocomplete.alternatives.map((alt) => alt.text)];

		expect(termStore.map((term) => term.value)).toStrictEqual(expected);
	});

	it('builds terms with the correct properties', () => {
		const fn = jest.spyOn(services.urlManager, 'set');
		const searchData = mockData.autocompleteMeta();
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(services, autocomplete, searchData.pagination, mockResetTrending, rootState);

		termStore.forEach((term) => {
			expect(term).toHaveProperty('value');
			expect(term).toHaveProperty('active');
			expect(term).toHaveProperty('url');
			expect(term.url).toHaveProperty('href');
			expect(term).toHaveProperty('preview');
		});

		expect(fn).toHaveBeenCalledTimes(termStore.length);
	});

	it('has terms with undefined url properties when no controller is present', () => {
		const searchData = mockData.autocompleteMeta();
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(undefined, autocomplete, searchData.pagination, mockResetTrending, rootState);

		termStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('has terms with undefined url properties when no urlManager is present', () => {
		const services = {};

		const searchData = mockData.autocompleteMeta();
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(services, autocomplete, searchData.pagination, mockResetTrending, rootState);

		termStore.forEach((term) => {
			expect(term.url).toBeUndefined();
		});
	});

	it('sets the correct active term', () => {
		const searchData = mockData.autocompleteMeta();
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(services, autocomplete, searchData.pagination, mockResetTrending, rootState);

		expect(termStore.filter((term) => term.active).map((term) => term.value)).toStrictEqual([autocomplete.query]);
	});

	it('has a preview function on terms', () => {
		const searchData = mockData.autocompleteMeta();
		const autocomplete = searchData.autocomplete;
		const termStore = new TermStore(services, autocomplete, searchData.pagination, mockResetTrending, rootState);

		expect(rootState.locks.terms.locked).toBe(false);

		termStore.forEach((term, index) => {
			expect(term.active).toBe(index === 0 ? true : false);
		});

		termStore[2].preview();

		expect(mockResetTrending).toHaveBeenCalled();

		termStore.forEach((term, index) => {
			expect(term.active).toBe(index === 2 ? true : false);
		});

		expect(rootState.locks.terms.locked).toBe(true);
	});
});
