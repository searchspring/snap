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
import { SearchResponseModelFilterTypeEnum } from '@searchspring/snapi-types';

export class FilterStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services: StoreServices, filtersData: SearchResponseModelFilter[] = [], meta: MetaResponseModel) {
		const filters = filtersData.map((filter) => {
			const facetMeta = meta.facets[filter.field] as MetaResponseModelFacet & MetaResponseModelFacetDefaults;

			switch (filter.type) {
				case SearchResponseModelFilterTypeEnum.Range:
					const rangeFilter = filter as SearchResponseModelFilterRange;
					return new RangeFilter(services, {
						facet: {
							field: rangeFilter.field,
							label: facetMeta?.label || rangeFilter.field,
						},
						value: {
							low: rangeFilter.value.low,
							high: rangeFilter.value.high,
							label: rangeFilter.label || `${rangeFilter.value.low} - ${rangeFilter.value.high}`,
						},
					});

				case SearchResponseModelFilterTypeEnum.Value:
				default:
					const valueFilter = filter as SearchResponseModelFilterValue;
					return new Filter(services, {
						facet: {
							field: valueFilter.field,
							label: facetMeta?.label || valueFilter.field,
						},
						value: {
							value: valueFilter.value,
							label: valueFilter.label,
						},
					});
			}
		});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super(...filters);
	}
}
class Filter {
	label: string;
	facet: {
		field: '';
		label: '';
	};
	value: {
		value: '';
		label: '';
	};

	url: UrlManager;

	constructor(services: StoreServices, filter) {
		this.facet = filter.facet;
		this.value = filter.value;
		this.label = `${filter.facet.label}: ${filter.value.label}`;

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
		field;
		label;
	};
	value: {
		low;
		high;
		label;
	};

	url: UrlManager;

	constructor(services: StoreServices, filter) {
		this.facet = filter.facet;
		this.value = filter.value;
		this.label = `${filter.facet.label}: ${filter.value.label}`;

		this.url = services?.urlManager?.remove('page').remove(`filter.${filter.facet.field}`, { low: filter.value.low, high: filter.value.high });

		makeObservable(this, {
			facet: observable,
			value: observable,
			label: observable,
		});
	}
}
