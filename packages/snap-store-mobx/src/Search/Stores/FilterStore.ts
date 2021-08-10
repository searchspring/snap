import { makeObservable, observable } from 'mobx';

export class FilterStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services, filters = [], meta) {
		filters = filters.map((filter) => {
			const facetMeta = meta.facets[filter.field];

			switch (filter.type) {
				case 'range':
					return new RangeFilter(services, {
						facet: {
							field: filter.field,
							label: facetMeta?.label || filter.field,
						},
						value: {
							low: filter.value.low,
							high: filter.value.high,
							label: filter.label || `${filter.value.low} - ${filter.value.high}`,
						},
					});

				case 'value':
				default:
					return new Filter(services, {
						facet: {
							field: filter.field,
							label: facetMeta?.label || filter.field,
						},
						value: {
							value: filter.value,
							label: filter.label,
						},
					});
			}
		});

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

	url;

	constructor(services, filter) {
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

	url;

	constructor(services, filter) {
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
