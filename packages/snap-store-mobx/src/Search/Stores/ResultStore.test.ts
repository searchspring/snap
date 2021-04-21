import { ResultStore } from './ResultStore';

import { SearchData } from '../../__mocks__/SearchData';
import { mockSearchController } from '../../__mocks__/mockControllers';

describe('ResultStore', () => {
	beforeEach(() => {
		expect.hasAssertions();
	});

	it('has a symbol species of Array', () => {
		expect(ResultStore[Symbol.species]).toBe(Array);
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		const results = new ResultStore(undefined, undefined, undefined, undefined);

		expect(results.length).toBe(0);
	});

	it('returns an empty array when passed an empty array [] of results', () => {
		const results = new ResultStore(mockSearchController, [], undefined, undefined);

		expect(results.length).toBe(0);
	});

	it('returns an array the same length as the results passed in', () => {
		const searchData = new SearchData();
		const results = new ResultStore(mockSearchController, searchData.results, searchData.pagination, searchData.merchandising);

		expect(results.length).toBe(searchData.results.length);
	});

	it('has result data that matches what was passed in', () => {
		const searchData = new SearchData();
		const results = new ResultStore(mockSearchController, searchData.results, searchData.pagination, searchData.merchandising);

		results.forEach((result, index) => {
			// check id
			expect(result.id).toBe(searchData.results[index].id);

			// check core mappings
			Object.keys(result.mappings.core).forEach((key) => {
				expect(result.mappings.core[key]).toBe(searchData.results[index].mappings.core[key]);
			});

			// check attributes
			Object.keys(result.attributes).forEach((key) => {
				expect(result.attributes[key]).toStrictEqual(searchData.results[index].attributes[key]);
			});
		});
	});

	describe('with inline banners', () => {
		it('splices inline banners into the results array', () => {
			const searchData = new SearchData({ search: 'inlineBanners' });
			const results = new ResultStore(mockSearchController, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(searchData.pagination.pageSize);
			expect(results[1].attributes.value).toBe(searchData.merchandising.content.inline[0].value);
		});

		it('splices inline banners into the results array', () => {
			const searchData = new SearchData({ siteId: 'ga9kq2', search: 'merchandising_page1' });
			const results = new ResultStore(mockSearchController, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(searchData.pagination.pageSize);
			expect(results[2].id).toBe(`ss-ib-${searchData.merchandising.content.inline[0].config.position.index}`);
			expect(results[2].attributes.value).toBe(searchData.merchandising.content.inline[0].value);
			expect(results[3].id).toBe(`ss-ib-${searchData.merchandising.content.inline[1].config.position.index}`);
			expect(results[3].attributes.value).toBe(searchData.merchandising.content.inline[1].value);
		});

		it('splices inline banners into the results array', () => {
			const searchData = new SearchData({ siteId: 'ga9kq2', search: 'merchandising_page2' });
			const results = new ResultStore(mockSearchController, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(1);
			expect(results[0].id).toBe(`ss-ib-${searchData.merchandising.content.inline[2].config.position.index}`);
			expect(results[0].attributes.value).toBe(searchData.merchandising.content.inline[2].value);
		});

		it('splices inline banners into the results array', () => {
			const searchData = {
				results: [],
				pagination: {
					page: 4,
					totalResults: 4,
					pageSize: 30,
				},
				merchandising: {
					content: {
						inline: [
							{
								value: 'engine',
								config: {
									position: {
										index: 0,
									},
								},
							},
							{
								value: 'car',
								config: {
									position: {
										index: 1,
									},
								},
							},
							{
								value: 'caboose!!!',
								config: {
									position: {
										index: 33333,
									},
								},
							},
						],
					},
				},
			};
			const results = new ResultStore(mockSearchController, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(1);
			expect(results[0].id).toBe(`ss-ib-${searchData.merchandising.content.inline[2].config.position.index}`);
			expect(results[0].attributes.value).toBe(searchData.merchandising.content.inline[2].value);
		});
	});
});
