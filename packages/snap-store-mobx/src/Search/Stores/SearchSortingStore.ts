import { observable, computed, makeObservable } from 'mobx';

import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StoreServices } from '../../types';
import type { MetaResponseModel, MetaResponseModelSortOption, SearchResponseModel } from '@searchspring/snapi-types';

type MetaResponseModelSortOptionMutated = MetaResponseModelSortOption & {
	active?: boolean;
	default?: boolean;
};

type SearchSortingStoreConfig = {
	services: StoreServices;
	data: {
		search: SearchResponseModel;
		meta: MetaResponseModel;
	};
};

export class SearchSortingStore {
	public options: Option[] = [];

	constructor(params: SearchSortingStoreConfig) {
		const { services, data } = params;
		const { meta } = data;
		const { sorting, search } = data.search;

		if (services && meta.sortOptions) {
			const activeSort = sorting?.length && sorting[0];

			const options = (meta.sortOptions || [])
				.filter((option: MetaResponseModelSortOptionMutated) => {
					if (!search?.query) {
						return option.type == 'field';
					}
					return option;
				})
				.map((option: MetaResponseModelSortOptionMutated, index: number) => {
					option.active = false;
					if (activeSort && activeSort.field == option.field && String(activeSort.direction) == String(option.direction)) {
						option.active = true;
					} else if (!activeSort && index === 0) {
						option.active = true;
					}

					option.default = false;
					if (index === 0) {
						// is the default sort
						option.default = true;
					}

					const optionObj = new Option(services, option, index);

					return optionObj;
				});

			this.options = options;
			makeObservable(this, {
				options: observable,
				current: computed,
			});
		}
	}

	public get current(): Option | undefined {
		return this.options.filter((option) => option.active).pop();
	}
}

class Option {
	public active: boolean;
	public default: boolean;
	public field: string;
	public label: string;
	public direction: string;
	public type: string;
	public value: string;
	public url: UrlManager;

	constructor(services: StoreServices, option: MetaResponseModelSortOptionMutated, index: number) {
		this.active = option.active!;
		this.default = option.default!;
		this.field = option.field!;
		this.label = option.label!;
		this.direction = option.direction!;
		this.type = option.type!;
		this.value = `${option.label}:${option.field}:${option.direction}:${index}`;

		if (this.default) {
			this.url = services.urlManager.remove('page').remove('sort');
		} else {
			this.url = services.urlManager.remove('page').set('sort', [{ field: this.field, direction: this.direction }]);
		}

		makeObservable(this, {
			field: observable,
			label: observable,
			direction: observable,
			type: observable,
			value: observable,
		});
	}
}
