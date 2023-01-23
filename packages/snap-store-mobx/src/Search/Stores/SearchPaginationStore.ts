import { observable, action, computed, makeObservable } from 'mobx';

import type { StoreConfigs, StoreServices, SearchStoreConfig } from '../../types';
import type { SearchResponseModelPagination, MetaResponseModel } from '@searchspring/snapi-types';
import type { UrlManager } from '@searchspring/snap-url-manager';

export class SearchPaginationStore {
	public services: StoreServices;
	public page: number;
	public pageSize: number;
	public pageSizeOptions: {
		label: string;
		value: number;
	}[];
	public defaultPageSize: number;
	public totalResults: number;
	public totalPages: number;
	public controllerConfig: StoreConfigs;

	constructor(
		config: StoreConfigs,
		services: StoreServices,
		paginationData: SearchResponseModelPagination = {
			page: undefined,
			pageSize: undefined,
			totalResults: undefined,
			totalPages: undefined,
		},
		meta: MetaResponseModel
	) {
		this.services = services;
		this.controllerConfig = config;

		this.page = paginationData.page!;
		this.pageSize = paginationData.pageSize!;
		this.totalResults = paginationData.totalResults!;
		this.defaultPageSize = meta?.pagination?.defaultPageSize! || 24;
		this.totalPages = paginationData.totalPages!;

		this.pageSizeOptions = [
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

		makeObservable(this, {
			page: observable,
			pageSize: observable,
			totalResults: observable,
			totalPages: observable,
			begin: computed,
			end: computed,
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

	public get begin(): number {
		if ((this.controllerConfig as SearchStoreConfig).settings?.infinite) {
			return 1;
		}
		return this.pageSize * (this.page - 1) + 1;
	}

	public get end(): number {
		if (this.pageSize * this.page > this.totalResults) {
			return this.totalResults;
		}

		return this.pageSize * this.page;
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
		if (this.page < this.totalPages) {
			return new Page(this.services, {
				number: this.page + 1,
			});
		}
	}

	public get previous(): Page | undefined {
		if (this.page > 1) {
			return new Page(this.services, {
				number: this.page - 1,
			});
		}
	}

	public getPages(min: number = 5, max?: number): Page[] {
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

export class Page {
	public services: StoreServices;
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
