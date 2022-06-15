import { makeObservable, observable, action, computed, reaction } from 'mobx';

import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StorageStore } from '../../Storage/StorageStore';
import type { AutocompleteStoreConfig, SearchStoreConfig, StoreServices, FacetStoreConfig } from '../../types';
import type {
	MetaResponseModel,
	MetaResponseModelFacet,
	MetaResponseModelFacetDefaults,
	MetaResponseModelFacetSlider,
	MetaResponseModelFacetValueMultipleEnum,
	MetaResponseModelFacetHierarchyAllOf,
	SearchResponseModelPagination,
	SearchResponseModelFacet,
	SearchResponseModelFacetRange,
	SearchResponseModelFacetValue,
	SearchResponseModelFacetValueAllOf,
	SearchResponseModelFacetValueAllOfValues,
	SearchRequestModelFilterRangeAllOfValue,
} from '@searchspring/snapi-types';

export class FacetStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}
	constructor(
		config: SearchStoreConfig | AutocompleteStoreConfig,
		services: StoreServices,
		storage: StorageStore,
		facetsData: SearchResponseModelFacet[] = [],
		pagination: SearchResponseModelPagination = {},
		meta: MetaResponseModel
	) {
		const facets = facetsData
			.filter((facet: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf) => {
				const facetMeta = facet.field && meta.facets && (meta.facets[facet.field] as MetaResponseModelFacet & MetaResponseModelFacetDefaults);

				// exclude facets that have no meta data
				if (!facetMeta) return false;

				// exclude facets that have mismatched meta data
				if ((facetMeta.display == 'slider' && facet.type !== 'range') || (facet.type == 'range' && facetMeta.display !== 'slider')) {
					return false;
				}

				// trim facets - remove facets that have no use
				const facetConfig = config.settings?.facets?.fields && facet.field && config.settings?.facets?.fields[facet.field];
				const shouldTrim = typeof facetConfig?.trim == 'boolean' ? facetConfig.trim : config.settings?.facets?.trim;
				if (shouldTrim) {
					if (
						facet.type === 'range' &&
						(facet as SearchResponseModelFacetRange)?.range?.low == (facet as SearchResponseModelFacetRange)?.range?.high
					) {
						return false;
					} else if (facet.values?.length == 0) {
						return false;
					} else if (!facet.filtered && facet.values?.length == 1) {
						return facet.values[0].count != pagination.totalResults;
					}
				}

				return true;
			})
			.map((facet) => {
				const facetMeta = facet.field && meta.facets && meta.facets[facet.field];
				switch (facet.type) {
					case 'range':
						return new RangeFacet(config, services, storage, facet, facetMeta || {});
					case 'value':
					case 'range-buckets':
					default:
						return new ValueFacet(config, services, storage, facet, facetMeta || {});
				}
			});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super(...facets);
	}
}

class Facet {
	public services: StoreServices;
	public type!: string;
	public field!: string;
	public filtered = false;
	public custom = {};
	public collapsed = false;
	public display = '';
	public label = '';
	public storage: StorageStore;

	constructor(
		services: StoreServices,
		storage: StorageStore,
		facet: SearchResponseModelFacetValue | SearchResponseModelFacetRange,
		facetMeta: MetaResponseModelFacet
	) {
		this.services = services;
		this.storage = storage;

		Object.assign(this, facetMeta, facet);

		makeObservable(this, {
			type: observable,
			field: observable,
			filtered: observable,
			custom: observable,
			collapsed: observable,
			display: observable,
			label: observable,
			clear: computed,
			toggleCollapse: action,
		});

		const collapseData = this.storage.get(`facets.${this.field}.collapsed`);
		this.collapsed = collapseData ?? this.collapsed;
		if (this.filtered && this.collapsed && typeof collapseData == 'undefined') {
			this.toggleCollapse();
		}
	}

	public get clear() {
		return {
			url: this.services.urlManager.remove('page').remove(`filter.${this.field}`),
		};
	}

	public toggleCollapse() {
		this.collapsed = !this.collapsed;

		this.storage.set(`facets.${this.field}.collapsed`, this.collapsed);
	}
}

export class RangeFacet extends Facet {
	public step?: number;
	public range?: SearchRequestModelFilterRangeAllOfValue = {
		low: 0,
		high: 0,
	};
	public active?: SearchRequestModelFilterRangeAllOfValue = {
		low: 0,
		high: 0,
	};
	public formatSeparator: string;
	public formatValue: string;

	constructor(
		config: SearchStoreConfig | AutocompleteStoreConfig,
		services: StoreServices,
		storage: StorageStore,
		facet: SearchResponseModelFacetRange,
		facetMeta: MetaResponseModelFacetSlider
	) {
		super(services, storage, facet, facetMeta);

		this.step = facet?.step;

		const facetConfig = (config.settings?.facets?.fields && facet.field && config.settings?.facets?.fields[facet.field]) || {};
		const shouldStore = typeof facetConfig?.storeRange == 'boolean' ? facetConfig.storeRange : config.settings?.facets?.storeRange;
		const storedRange = shouldStore && this.storage.get(`facets.${this.field}.range`);
		if (storedRange && facet.filtered && (facet.range?.low! > storedRange.low || facet.range?.high! < storedRange.high)) {
			// range from API has shrunk
			this.range = this.storage.get(`facets.${this.field}.range`);
		} else {
			this.storage.set(`facets.${this.field}.range`, facet.range);
			this.range = facet.range;
		}

		// TODO: Fix api
		// needed when API returns no active (only seems to be when range.low == range.high)
		this.active = facet.active || facet.range;

		this.formatSeparator = facetMeta?.formatSeparator || '-';
		this.formatValue = facetMeta?.formatValue || '%01.2f';

		makeObservable(this, {
			step: observable,
			range: observable,
			active: observable,
			formatSeparator: observable,
			formatValue: observable,
		});
	}
}

export class ValueFacet extends Facet {
	public values: Array<HierarchyValue | Value | RangeValue | undefined> = [];

	public search = {
		input: '',
	};

	public multiple!: MetaResponseModelFacetValueMultipleEnum;

	public overflow: {
		enabled: boolean;
		limited: boolean;
		limit: number;
		remaining: number | undefined;
		setLimit: (limit: number) => void;
		toggle: (val?: boolean) => void;
		calculate: () => void;
	} = {
		enabled: false,
		limited: true,
		limit: 0,
		remaining: undefined,
		setLimit: function (limit: number) {
			if (limit != this.limit) {
				this.enabled = true;
				this.limit = limit;
				this.calculate();
			}
		},
		toggle: (val?: boolean) => {
			if (typeof val != 'undefined') {
				this.overflow.limited = val;
			} else {
				this.overflow.limited = !this.overflow.limited;
			}

			this.storage.set(`facets.${this.field}.overflow.limited`, this.overflow.limited);

			this.overflow.calculate();
		},
		calculate: () => {
			if (this.overflow.limit > 0) {
				const remaining = this.values.length - this.overflow.limit;

				if (remaining > 0 && !this.search.input) {
					this.overflow.enabled = true;

					if (this.overflow.limited) {
						this.overflow.remaining = remaining;
					} else {
						this.overflow.remaining = 0;
					}
				} else {
					this.overflow.enabled = false;
				}
			}
		},
	};

	constructor(
		config: SearchStoreConfig | AutocompleteStoreConfig,
		services: StoreServices,
		storage: StorageStore,
		facet: SearchResponseModelFacetValue,
		facetMeta: MetaResponseModelFacet
	) {
		super(services, storage, facet, facetMeta);

		this.multiple = this.multiple;

		this.values =
			(facet.values &&
				facet.values.map((value) => {
					switch (facet.type) {
						case 'value':
							if (facetMeta.display === 'hierarchy') {
								const filteredValues = facet?.values?.filter((value) => value.filtered) || [];
								return new HierarchyValue(services, this, value, filteredValues);
							} else {
								// converting values to strings to ensure UrlManager state matches state created from URL
								value.value = value?.value?.toString();
								return new Value(services, this, value);
							}
						case 'range-buckets':
							return new RangeValue(services, this, value);
					}
				})) ||
			[];

		const facetConfig: FacetStoreConfig = (config.settings?.facets?.fields && facet.field && config.settings?.facets?.fields[facet.field]) || {};
		const shouldPin = typeof facetConfig?.pinFiltered == 'boolean' ? facetConfig.pinFiltered : config.settings?.facets?.pinFiltered;
		if (shouldPin && facetMeta.display !== 'hierarchy') {
			this.values.sort((a, b) => Number(b!.filtered) - Number(a!.filtered));
		}

		const overflowLimitedState = this.storage.get(`facets.${this.field}.overflow.limited`);

		if (typeof overflowLimitedState != 'undefined') {
			this.overflow.toggle(overflowLimitedState);
		}

		makeObservable(this, {
			values: observable,
			search: observable,
			multiple: observable,
			overflow: observable,
			refinedValues: computed,
		});

		reaction(
			() => this.search.input,
			() => {
				this.overflow.calculate();
			}
		);
	}

	public get refinedValues() {
		let values = this.values || [];

		if (this.search.input) {
			const search = new RegExp(escapeRegExp(this.search.input), 'i');
			values = this.values.filter((value) => String(value?.label || '').match(search));
		}

		if (this.overflow.enabled && this.overflow.limited) {
			values = values.slice(0, this.overflow.limit);
		}

		return values;
	}
}

export class Value {
	public label!: string;
	public count!: number;
	public filtered!: boolean;
	public value!: string;
	public custom!: {};
	public url: UrlManager;
	public preview?: () => void;

	constructor(services: StoreServices, facet: ValueFacet, value: SearchResponseModelFacetValueAllOfValues) {
		Object.assign(this, value);

		if (this.filtered) {
			this.url = services.urlManager.remove('page').remove(`filter.${facet.field}`, value.value);
		} else {
			let valueUrl = services.urlManager.remove('page');
			if (facet.multiple == 'single') {
				valueUrl = valueUrl?.remove(`filter.${facet.field}`);
			}
			this.url = valueUrl?.merge(`filter.${facet.field}`, value.value);
		}
	}
}

export class HierarchyValue extends Value {
	public level = 0;
	public history = false;

	constructor(
		services: StoreServices,
		facet: ValueFacet & MetaResponseModelFacetHierarchyAllOf,
		value: SearchResponseModelFacetValueAllOfValues,
		filteredValues: SearchResponseModelFacetValueAllOfValues[]
	) {
		super(services, facet, value);

		if (value.value && facet.hierarchyDelimiter) {
			this.level = value.value.split(facet.hierarchyDelimiter).length;
		}

		if (facet.filtered && filteredValues?.length) {
			const filteredLevel = facet?.hierarchyDelimiter && filteredValues[0].value?.split(facet.hierarchyDelimiter).length;
			if (filteredLevel && this.level <= filteredLevel) {
				this.history = true;
			}
		}

		if (value.value) {
			this.url = services.urlManager.remove('page').set(`filter.${facet.field}`, value.value);
		} else {
			this.url = services.urlManager.remove('page').remove(`filter.${facet.field}`);
		}
	}
}

export class RangeValue {
	public label!: string;
	public count!: number;
	public filtered!: boolean;
	public low!: number;
	public high!: number;
	public custom!: {};
	public url: UrlManager;

	constructor(services: StoreServices, facet: ValueFacet, value: SearchResponseModelFacetValueAllOfValues) {
		Object.assign(this, value);

		if (this.filtered) {
			this.url = services.urlManager.remove('page').remove(`filter.${facet.field}`, [{ low: this.low, high: this.high }]);
		} else {
			let valueUrl = services.urlManager.remove('page');

			if (facet.multiple == 'single') {
				valueUrl = valueUrl?.remove(`filter.${facet.field}`);
			}

			this.url = valueUrl?.merge(`filter.${facet.field}`, [{ low: this.low, high: this.high }]);
		}
	}
}

function escapeRegExp(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
