import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelResultCoreMappings } from '@searchspring/snapi-types';

import { Banner, ResultStore } from './ResultStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

const searchConfig = {
	id: 'search',
};

describe('ResultStore', () => {
	beforeEach(() => {
		expect.hasAssertions();
	});

	it('has a symbol species of Array', () => {
		expect(ResultStore[Symbol.species]).toBe(Array);
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		// @ts-ignore
		const results = new ResultStore(undefined, undefined, undefined, undefined, undefined);

		expect(results.length).toBe(0);
	});

	it('returns an empty array when passed an empty array [] of results', () => {
		const results = new ResultStore(searchConfig, services, [], undefined, undefined);

		expect(results.length).toBe(0);
	});

	it('returns an array the same length as the results passed in', () => {
		const searchData = mockData.searchMeta();

		const results = new ResultStore(searchConfig, services, searchData.results, searchData.pagination, searchData.merchandising);

		expect(results.length).toBe(searchData.results?.length);
	});

	it('has result data that matches what was passed in', () => {
		const searchData = mockData.searchMeta();

		const results = new ResultStore(searchConfig, services, searchData.results, searchData.pagination, searchData.merchandising);

		results.forEach((result, index) => {
			// check id
			expect(result.id).toBe(searchData.results && searchData.results[index].id);

			// check core mappings
			Object.keys(result.mappings.core!).forEach((key) => {
				const core = searchData.results && searchData.results[index]?.mappings?.core;
				const value = core && core[key as keyof SearchResponseModelResultCoreMappings];
				expect(result.mappings?.core && result.mappings?.core[key as keyof SearchResponseModelResultCoreMappings]).toBe(value);
			});

			// check attributes
			Object.keys(result.attributes).forEach((key) => {
				const attributes = searchData.results && searchData.results[index] && searchData.results[index].attributes;
				const value = attributes && attributes[key];
				expect(result.attributes[key]).toStrictEqual(value);
			});
		});
	});

	describe('with inline banners', () => {
		it('splices inline banners into the results array', () => {
			const searchData = mockData.searchMeta('inlineBanners');

			const results = new ResultStore(searchConfig, services, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(searchData.pagination?.pageSize);
			expect((results[1] as Banner).value).toBe(searchData.merchandising?.content?.inline && searchData.merchandising.content.inline[0].value);
		});

		it('splices inline banners into the results array', () => {
			const searchData = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');

			const results = new ResultStore(searchConfig, services, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(searchData.pagination?.pageSize);
			const inlineData = searchData.merchandising?.content?.inline!;
			expect(results[2].id).toBe(`ss-ib-${inlineData[0].config?.position?.index}`);
			expect((results[2] as Banner).value).toBe(inlineData[0].value);
			expect(results[3].id).toBe(`ss-ib-${inlineData[1].config?.position?.index}`);
			expect((results[3] as Banner).value).toBe(inlineData[1].value);
		});

		it('splices inline banners into the results array', () => {
			const searchData = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page2');

			const results = new ResultStore(searchConfig, services, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(1);
			const inlineData = searchData.merchandising?.content?.inline!;
			expect(results[0].id).toBe(`ss-ib-${inlineData[2].config?.position?.index}`);
			expect((results[0] as Banner).value).toBe(inlineData[2].value);
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
			const results = new ResultStore(searchConfig, services, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(1);
			expect(results[0].id).toBe(`ss-ib-${searchData.merchandising.content.inline[2].config.position.index}`);
			expect((results[0] as Banner).value).toBe(searchData.merchandising.content.inline[2].value);
		});
	});
});
