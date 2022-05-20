import { makeObservable, observable } from 'mobx';

import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StoreServices } from '../../types';
import type {
	SearchResponseModelFilter,
	MetaResponseModel,
	SearchResponseModelFilterRange,
	SearchResponseModelFilterValue,
	MetaResponseModelFacetDefaults,
	MetaResponseModelFacet,
} from '@searchspring/snapi-types';

export class FilterStore extends Array<RangeFilter | Filter> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services: StoreServices, filtersData: SearchResponseModelFilter[] = [], meta: MetaResponseModel) {
		const filters = filtersData.map((filter) => {
			const field = filter.field!;
			const facetMeta = meta.facets && (meta.facets[field] as MetaResponseModelFacet & MetaResponseModelFacetDefaults);

			switch (filter.type) {
				case 'range':
					const rangeFilter = filter as SearchResponseModelFilterRange;
					return new RangeFilter(services, rangeFilter, facetMeta!);

				case 'value':
				default:
					const valueFilter = filter as SearchResponseModelFilterValue;
					return new Filter(services, valueFilter, facetMeta!);
			}
		});

		super(...filters);
	}
}

class Filter {
	label: string;
	facet: {
		field?: string;
		label?: string;
	};
	value: {
		value?: string;
		label?: string;
	};

	url: UrlManager;

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

class RangeFilter {
	label: string;
	facet: {
		field?: string;
		label?: string;
	};
	value: {
		low?: number;
		high?: number;
		label: string;
	};

	url: UrlManager;

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
