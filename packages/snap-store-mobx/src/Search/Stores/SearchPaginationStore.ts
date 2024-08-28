import { observable, action, computed, makeObservable } from 'mobx';

import type { StoreServices, SearchStoreConfig } from '../../types';
import type { UrlManager } from '@searchspring/snap-url-manager';
import { MetaResponseModel, SearchResponseModel } from '@searchspring/snapi-types';

type SearchPaginationStoreConfig = {
	config?: SearchStoreConfig; // optional due to AutocompleteStore using SearchPaginationStore
	services: StoreServices;
	data: {
		search: SearchResponseModel;
		meta: MetaResponseModel;
	};
};

export class SearchPaginationStore {
	public services: StoreServices;
	public page: number;
	public pageSize: number;
	public pageSizeOption?: PageSizeOption;
	public pageSizeOptions: PageSizeOption[];
	public defaultPageSize: number;
	public totalResults: number;
	public totalPages: number;
	public controllerConfig?: SearchStoreConfig;

	constructor(params: SearchPaginationStoreConfig) {
		const { services, data, config } = params || {};
		const { search, meta } = data || {};
		const { pagination } = search || {};

		const paginationSettings = config?.settings?.pagination;

		this.services = services;
		this.controllerConfig = config;

		this.page = pagination?.page!;
		this.pageSize = pagination?.pageSize!;
		this.totalResults = pagination?.totalResults!;
		this.defaultPageSize = meta?.pagination?.defaultPageSize!;
		this.totalPages = pagination?.totalPages!;

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

		this.pageSizeOption = this.pageSizeOptions.find((option) => option.active);

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
		if (this.controllerConfig?.settings?.infinite) {
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
