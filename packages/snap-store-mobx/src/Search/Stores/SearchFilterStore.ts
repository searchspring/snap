import { makeObservable, observable } from 'mobx';

import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StoreServices } from '../../types';
import type {
	SearchResponseModelFilterRange,
	SearchResponseModelFilterValue,
	MetaResponseModelFacetDefaults,
	MetaResponseModelFacet,
	SearchResponseModel,
	MetaResponseModel,
} from '@searchspring/snapi-types';

type SearchFilterStoreConfig = {
	services: StoreServices;
	data: {
		search: SearchResponseModel;
		meta: MetaResponseModel;
	};
};

export class SearchFilterStore extends Array<RangeFilter | Filter> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(params: SearchFilterStoreConfig) {
		const { services, data } = params;
		const { search, meta } = data;
		const { filters } = search;

		const filtersArr =
			filters?.map((filter) => {
				const field = filter.field!;
				const facetMeta = meta.facets && meta.facets[field];

				switch (filter.type) {
					case 'range':
						const rangeFilter = filter as SearchResponseModelFilterRange;
						return new RangeFilter(services, rangeFilter, facetMeta!);

					case 'value':
					default:
						const valueFilter = filter as SearchResponseModelFilterValue;
						return new Filter(services, valueFilter, facetMeta!);
				}
			}) || [];

		super(...filtersArr);
	}
}

export class Filter {
	public label: string;
	public facet: {
		field?: string;
		label?: string;
	};
	public value: {
		value?: string;
		label?: string;
	};

	public url: UrlManager;

	constructor(services: StoreServices, filter: SearchResponseModelFilterValue, meta: MetaResponseModelFacet & MetaResponseModelFacetDefaults) {
		this.facet = {
			field: filter.field,
			label: meta?.label || filter.field,
		};
		this.value = {
			value: filter.value,
			label: filter.label,
		};
		this.label = `${this.facet.label}: ${this.value.label}`;

		this.url = services?.urlManager?.remove('page').remove(`filter.${this.facet.field}`, this.value.value);

		makeObservable(this, {
			facet: observable,
			value: observable,
			label: observable,
		});
	}
}

export class RangeFilter {
	public label: string;
	public facet: {
		field?: string;
		label?: string;
	};
	public value: {
		low?: number;
		high?: number;
		label: string;
	};

	public url: UrlManager;

	constructor(services: StoreServices, filter: SearchResponseModelFilterRange, meta: MetaResponseModelFacet & MetaResponseModelFacetDefaults) {
		this.facet = {
			field: filter.field,
			label: meta?.label || filter.field,
		};
		this.value = {
			low: filter?.value?.low,
			high: filter?.value?.high,
			label: filter.label || `${filter?.value?.low} - ${filter?.value?.high}`,
		};
		this.label = `${this.facet.label}: ${this.value.label}`;

		this.url = services?.urlManager?.remove('page').remove(`filter.${this.facet.field}`, { low: this.value.low, high: this.value.high });

		makeObservable(this, {
			facet: observable,
			value: observable,
			label: observable,
		});
	}
}
