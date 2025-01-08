import { observable, action, computed, makeObservable } from 'mobx';

import type { StoreConfigs, StoreServices, SearchStoreConfig } from '../../types';
import type { SearchResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import type { UrlManager } from '@searchspring/snap-url-manager';

type SearchResponseModelModified = SearchResponseModel & { pagination?: { begin?: number; end?: number } };

export class SearchPaginationStore {
	public services: StoreServices;
	public page: number;
	public pageSize: number;
	public pageSizeOptions: PageSizeOption[];
	public defaultPageSize: number;
	public totalResults: number;
	public totalPages: number;
	public controllerConfig: StoreConfigs;
	public begin: number;
	public end: number;
	public infiniteLoad?: 'next' | 'previous';

	constructor(
		config: StoreConfigs,
		services: StoreServices,
		paginationData: SearchResponseModelModified['pagination'] = {
			page: undefined,
			pageSize: undefined,
			totalResults: undefined,
			totalPages: undefined,
		},
		meta: MetaResponseModel,
		previousPagination?: SearchPaginationStore,
		infiniteLoad?: boolean
	) {
		const paginationSettings = (config as SearchStoreConfig)?.settings?.pagination;

		this.services = services;
		this.controllerConfig = config;

		this.page = Math.ceil(paginationData.end! / paginationData.pageSize!);
		console.log('which page are we on?', this.page);
		this.pageSize = paginationData.pageSize!;
		this.totalResults = paginationData.totalResults!;
		this.defaultPageSize = meta?.pagination?.defaultPageSize!;
		this.totalPages = paginationData.totalPages!;
		this.begin = paginationData.begin!;
		this.end = paginationData.end!;
		this.infiniteLoad = infiniteLoad ? 'next' : undefined;

		/*
			pages:
			1-24	(first)
			25-48
			49-72
			73-96
			97-103 (last)
		*/

		if ((this.controllerConfig as SearchStoreConfig).settings?.infinite) {
			const unload = (this.controllerConfig as SearchStoreConfig).settings?.infinite?.unload;
			if (this.infiniteLoad && previousPagination?.totalResults) {
				this.infiniteLoad = this.page > previousPagination.page ? 'next' : 'previous';
				if (this.infiniteLoad == 'next') {
					this.begin = previousPagination.begin;
					console.log('begin and end (initial next)', this.begin, this.end);
				} else if (this.infiniteLoad == 'previous') {
					// only possible when using unload functionality
					this.begin = previousPagination.begin - previousPagination.pageSize;
					this.end = previousPagination.end;
					console.log('begin and end (initial previous)', this.begin, this.end);
				}

				if (unload) {
					const maxPages = 3;
					const currentPages = Math.ceil((this.end - this.begin) / previousPagination.pageSize);
					console.log('current pages: ', currentPages);
					console.log('previous pagination', previousPagination);
					if (currentPages > maxPages) {
						if (this.infiniteLoad == 'next') {
							this.begin = this.begin + previousPagination.pageSize;
							console.log('begin and end (unload next)', this.begin, this.end);
						} else if (this.infiniteLoad == 'previous') {
							this.end = previousPagination.end - previousPagination.pageSize;
							console.log('begin and end (unload previous)', this.begin, this.end);
						}
					}
				}

				console.log('begining...', this.begin);
				console.log('ending...', this.end);
			}
		}

		const pageSizeOptions = paginationSettings?.pageSizeOptions || [
			{
				label: `Show ${this.defaultPageSize}`,
				value: this.defaultPageSize,
			},
			{
				label: `Show ${this.defaultPageSize * 2}`,
				value: this.defaultPageSize * 2,
			},
			{
				label: `Show ${this.defaultPageSize * 3}`,
				value: this.defaultPageSize * 3,
			},
		];

		//dont allow any page size options over the api limit of 100
		this.pageSizeOptions = pageSizeOptions
			.filter((option) => option.value <= 100)
			.map(
				(pageOption: any) =>
					new PageSizeOption(this.services, this.pageSize, {
						label: pageOption.label,
						value: pageOption.value,
					})
			);

		makeObservable(this, {
			page: observable,
			pageSize: observable,
			totalResults: observable,
			totalPages: observable,
			begin: observable,
			end: observable,
			multiplePages: computed,
			current: computed,
			first: computed,
			last: computed,
			next: computed,
			previous: computed,
			getPages: action,
			setPageSize: action,
		});
	}

	public get multiplePages(): boolean {
		return this.pageSize < this.totalResults;
	}

	public get current(): Page {
		return new Page(this.services, {
			number: this.page,
			active: true,
		});
	}

	public get first(): Page {
		return new Page(this.services, {
			number: 1,
			active: this.page == 1,
		});
	}

	public get last(): Page {
		return new Page(this.services, {
			number: this.totalPages,
			active: this.totalPages == this.page,
		});
	}

	public get next(): Page | undefined {
		if (this.end < this.totalResults) {
			const page = Math.ceil(this.end / this.pageSize);
			console.log('next page is', page + 1);
			return new Page(this.services, {
				number: page + 1,
			});
		}
	}

	public get previous(): Page | undefined {
		if (this.begin > 1) {
			const page = Math.ceil(this.begin / this.pageSize);
			console.log('previous page is', page - 1);
			return new Page(this.services, {
				number: page - 1,
			});
		}
	}

	public getPages(min = 5, max?: number): Page[] {
		if (!Number.isInteger(min)) {
			return [];
		}

		if (typeof max == 'undefined' || !Number.isInteger(max)) {
			const surrounding = min - 1;

			let from = this.page;
			let to = this.page;
			let last = to - from;

			do {
				last = to - from;

				if (to < this.totalPages) {
					to++;
				}

				if (to - from >= surrounding) {
					break;
				}

				if (from > 1) {
					from--;
				}
			} while (last != to - from && to - from < surrounding);

			min = from - this.page;
			max = to - this.page;
		} else {
			min = -Math.abs(min);
			max = Math.abs(max);
		}

		const pages = [];

		for (let i = this.page + min; i <= this.page + max; i++) {
			if (i > 0 && i <= this.totalPages) {
				pages.push(
					new Page(this.services, {
						number: i,
						active: i == this.page,
					})
				);
			}
		}

		return pages;
	}

	public setPageSize(num: number): void {
		if (num) {
			this.services.urlManager.remove('page').set('pageSize', num).go();
		}
	}
}

export class PageSizeOption {
	private services: StoreServices;
	public value: number;
	public label: string;
	public url: UrlManager;
	public active: boolean;

	constructor(
		services: StoreServices,
		currentPageSize: number,
		option: {
			value: number;
			label: string;
		}
	) {
		this.services = services;
		this.value = option.value;
		this.label = option.label;
		this.url = this.services?.urlManager.remove('page').set('pageSize', option.value);
		this.active = Boolean(currentPageSize == option.value);
	}
}

export class Page {
	private services: StoreServices;
	public number: number;
	public active: boolean;
	public url: UrlManager;
	public key: string;

	constructor(
		services: StoreServices,
		page: {
			number: number;
			active?: boolean;
		}
	) {
		this.services = services;
		this.number = page.number;
		this.active = page.active || false;
		this.url = this.services?.urlManager?.set('page', this.number);
		this.key = this.url.href;
	}
}
