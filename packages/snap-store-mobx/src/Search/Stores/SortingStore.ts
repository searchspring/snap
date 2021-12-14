import { observable, computed, makeObservable } from 'mobx';

import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StoreServices } from '../../types';
import type {
	MetaResponseModel,
	MetaResponseModelSortOption,
	MetaResponseModelSortOptionDirectionEnum,
	SearchResponseModelFacetRangeBucketsAllOfValues,
	SearchResponseModelSearch,
	SearchResponseModelSorting,
} from '@searchspring/snapi-types';

interface MetaResponseModelSortOptionMutated extends MetaResponseModelSortOption {
	active?: boolean;
	default?: boolean;
}

export class SortingStore {
	options: Option[] = [];

	constructor(services: StoreServices, sorting: SearchResponseModelSorting[], search: SearchResponseModelSearch, meta: MetaResponseModel) {
		if (services && meta.sortOptions) {
			const activeSort = sorting && sorting.length && sorting[0];

			this.options = meta.sortOptions
				.filter((option: MetaResponseModelSortOptionMutated) => {
					if (!search?.query) {
						return option.type == 'field';
					}
					return option;
				})
				.map((option: MetaResponseModelSortOptionMutated, index: number) => {
					option.active = false;
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					if (activeSort && activeSort.field == option.field && activeSort.direction == option.direction) {
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

			makeObservable(this, {
				options: observable,
				current: computed,
			});
		}
	}

	get current(): Option {
		return this.options.filter((option) => option.active).pop();
	}
}

class Option {
	active: boolean;
	default: boolean;
	field: string;
	label: string;
	direction: string;
	type: string;
	value: string;
	url: UrlManager;

	constructor(services: StoreServices, option, index) {
		this.active = option.active;
		this.default = option.default;
		this.field = option.field;
		this.label = option.label;
		this.direction = option.direction;
		this.type = option.type;
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
