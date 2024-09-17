import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { SearchPaginationStore } from './SearchPaginationStore';
import { SearchResponseModel, MetaResponseModel, MetaResponseModelFacetDefaults } from '@searchspring/snapi-types';
import { SearchStoreConfig } from '../../types';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

const searchConfig = {
	id: 'search',
};

describe('Pagination Store', () => {
	let searchData: { meta: MetaResponseModel; search: SearchResponseModel };
	beforeEach(() => {
		expect.hasAssertions();

		searchData = mockData.searchMeta();
	});

	it('sets properties to undefined given undefined', () => {
		// @ts-ignore
		const pagination = new SearchPaginationStore({});
		expect(pagination.page).toBeUndefined();
		expect(pagination.pageSize).toBeUndefined();
		expect(pagination.totalResults).toBeUndefined();
	});

	it('sets the page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.page).toBe(searchData.search.pagination?.page);
	});

	it('sets the pageSize', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.pageSize).toBe(searchData.search.pagination?.pageSize);
	});

	it('sets the defaultPageSize', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.defaultPageSize).toBe(searchData?.meta?.pagination?.defaultPageSize);
	});

	it('sets the totalResults', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.totalResults).toBe(searchData.search.pagination?.totalResults);
	});

	it('sets the default pageSizeOptions', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.pageSizeOptions).toBeDefined;
		expect(pagination.pageSizeOptions[0].label).toBeDefined;
		expect(pagination.pageSizeOptions[0].value).toBeGreaterThan(0);
		expect(pagination.pageSizeOptions[0].active).toBeDefined();
		expect(pagination.pageSizeOptions[0].url).toBeDefined();
	});

	it('can pass in custom pageSizeOptions', () => {
		let customPageSizeOptions = [
			{
				label: `show 30`,
				value: 30,
			},
			{
				label: `show 40`,
				value: 40,
			},
			{
				label: `show 50`,
				value: 50,
			},
		];

		let tempConfig = { ...searchConfig, settings: { pagination: { pageSizeOptions: customPageSizeOptions } } };
		const pagination = new SearchPaginationStore({
			config: tempConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});

		for (let i = 0; i < pagination.pageSizeOptions.length; i++) {
			expect(pagination.pageSizeOptions[i].label).toBe(customPageSizeOptions[i].label);
			expect(pagination.pageSizeOptions[i].value).toBe(customPageSizeOptions[i].value);
			expect(pagination.pageSizeOptions[i].active).toBeDefined();
			expect(pagination.pageSizeOptions[i].url).toBeDefined();
		}
	});

	it('doesnt allow pageSizeOptions over the api limit of 100', () => {
		let customPageSizeOptions = [
			{
				label: `show 30`,
				value: 30,
			},
			{
				label: `show 40`,
				value: 40,
			},
			{
				label: `show 50`,
				value: 50,
			},
			{
				label: `show 106`,
				value: 106,
			},
		];

		let tempConfig = { ...searchConfig, settings: { pagination: { pageSizeOptions: customPageSizeOptions } } };
		const pagination = new SearchPaginationStore({
			config: tempConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});

		expect(pagination.pageSizeOptions.length).toEqual(customPageSizeOptions.length - 1);
		expect(pagination.pageSizeOptions.filter((opt) => opt.value == 106)).toHaveLength(0);
	});

	it('knows the begin number', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.begin).toBeDefined;
		expect(pagination.begin).toBe(1);
	});

	it('knows the begin number when on a specific page', () => {
		searchData = mockData.searchMeta('page10');
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.begin).toBeDefined;
		expect(pagination.begin).toBe(217);
	});

	it('knows the end number when not on the last page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.end).toBeDefined;

		expect(pagination.end).toEqual(searchData.search.pagination?.pageSize! * searchData.search.pagination?.page!);
		expect(pagination.end).toEqual(pagination.pageSize * pagination.page);
	});

	it('knows the end number when on the last page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		const lastPage = Math.floor(pagination.totalResults / pagination.pageSize) + 1;
		pagination.page = lastPage;

		expect(pagination.end).toBe(pagination.totalResults);
	});

	it('does not have a next page when on the last page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		const lastPage = Math.floor(pagination.totalResults / pagination.pageSize) + 1;
		pagination.page = lastPage;

		expect(pagination.next).toBeUndefined();
	});

	it('knows the total pages', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.totalPages).toBeDefined;
		expect(pagination.totalPages).toEqual(Math.ceil(searchData.search.pagination?.totalResults! / searchData.search.pagination?.pageSize!));
	});

	it('can get multiple pages', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.multiplePages).toBeDefined;
		expect(pagination.multiplePages).toEqual(Boolean(searchData.search.pagination?.pageSize! < searchData.search.pagination?.totalResults!));
	});

	it('can get current page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.current).toBeDefined;
		expect(pagination.current.number).toBeGreaterThan(0);
		expect(pagination.current.number).toBeLessThanOrEqual(pagination.last.number);
		expect(pagination.current.active).toBeTruthy;

		expect(pagination.current.url).toBeDefined();
		expect(pagination.current.url.href).not.toMatch('page');
	});

	it('can get first page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.first).toBeDefined;
		expect(pagination.first.number).toEqual(1);
		expect(pagination.first.active).toEqual(Boolean(searchData.search.pagination?.page === 1));
	});

	it('can get last page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.last).toBeDefined;
		expect(pagination.last.number).toEqual(pagination.totalPages);
		expect(pagination.last.active).toEqual(Boolean(pagination.totalPages === searchData.search.pagination?.page));
	});

	it('does not get next page when on last page', () => {
		// @ts-ignore
		searchData.search.pagination.page = Math.floor(searchData.search.pagination?.totalResults! / searchData.search.pagination?.pageSize!) + 1;

		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.next).toBeUndefined();
	});

	it('can get next page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});

		expect(pagination.next).toBeDefined;
		expect(pagination.next?.number).toEqual(searchData.search.pagination?.page! + 1);
	});

	it('does not get prev page when on first page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});

		expect(pagination.previous).toBeUndefined();
	});

	it('does not get prev page when on first page', () => {
		searchData = mockData.searchMeta('page10');
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});

		expect(pagination.previous).toBeDefined;
		expect(pagination.previous?.number).toEqual(searchData.search.pagination?.page! - 1);
	});

	it('can get prev page when not on first page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		const newPage = 3;
		pagination.page = newPage;
		const page = pagination.previous;
		expect(page?.number).toBe(newPage - 1);
	});

	it('creates a page object that uses the urlManager', () => {
		const fn = jest.spyOn(services.urlManager, 'set');

		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		pagination.getPages(1);
		expect(fn).toHaveBeenCalled();
	});

	it('can set page size', () => {
		const removeFn = jest.spyOn(services.urlManager, 'remove');

		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		pagination.setPageSize(30);

		expect(removeFn).toHaveBeenCalledWith('page');
		expect(services.urlManager.state.pageSize).toEqual(30);
	});

	it('returns an array of pages with defaults if min and max pages arent passed into getPages', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.getPages(undefined, undefined)).toHaveLength(5);
	});

	it('returns an array of pages', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		expect(pagination.getPages(1, 5)).toHaveLength(6);
		expect(pagination.getPages(-1, 5)).toHaveLength(6);
	});

	it('returns an array of pages of length specified even when on the last page', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		const lastPage = Math.floor(pagination.totalResults / pagination.pageSize) + 1;
		pagination.page = lastPage;
		const pages = pagination.getPages(5);
		expect(pages).toHaveLength(5);
		expect(pages[0].number).toBe(lastPage - 4);
		expect(pages[pages.length - 1].number).toBe(lastPage);
		expect(pages[pages.length - 1]).toStrictEqual(pagination.last);
	});

	it('pages have proper values', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		const pages = pagination.getPages(1, 5);

		pages.forEach((page) => {
			expect(page.number).toBeDefined();
			expect(page.active).toBeDefined();
			expect(page.url).toBeDefined();
		});
	});

	it('pages have proper values when max is a float', () => {
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		const min = 3;
		const max = 5.3;
		const pages = pagination.getPages(min, max);
		expect(pages.length).toBe(Math.ceil(max) - min);
	});

	it('pages have proper values when max is a float', () => {
		searchData = mockData.searchMeta('page10');
		const pagination = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: searchData.search,
				meta: searchData.meta,
			},
		});
		const pages = pagination.getPages(5);
		expect(pages.length).toBe(5);
	});
});
