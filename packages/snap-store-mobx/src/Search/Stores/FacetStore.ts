import { makeObservable, observable, action, computed, reaction } from 'mobx';

import { StorageStore } from '../../Storage/StorageStore';

export class FacetStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(controller, storage: StorageStore, facets = [], meta) {
		facets = facets.map((facet) => {
			const facetMeta = meta.facets[facet.field];

			switch (facet.type) {
				case 'range':
					return new RangeFacet(controller, storage, facet, facetMeta);
				case 'value':
				case 'range-buckets':
				default:
					return new ValueFacet(controller, storage, facet, facetMeta);
			}
		});

		super(...facets);
	}
}

class Facet {
	private controller;
	type: string;
	field: string;
	filtered = false;
	custom = {};
	collapsed = false;
	display = '';
	label = '';
	storage: StorageStore;

	constructor(controller, storage: StorageStore, facet, facetMeta) {
		this.controller = controller;
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

		const collapseData = this.storage.get(`${this.field}.collapsed`);
		this.collapsed = collapseData ?? this.collapsed;
		if (this.filtered && this.collapsed && typeof collapseData == 'undefined') {
			this.toggleCollapse();
		}
	}

	get clear() {
		return {
			url: this.controller?.urlManager?.remove('page').remove(`filter.${this.field}`),
		};
	}

	toggleCollapse() {
		this.collapsed = !this.collapsed;

		this.storage.set(`${this.field}.collapsed`, this.collapsed);
	}
}

class RangeFacet extends Facet {
	step: number;
	range: {
		low: 0;
		high: 0;
	};
	active: {
		low: 0;
		high: 0;
	};
	formatSeparator: string;
	formatValue: string;

	constructor(controller, storage, facet, facetMeta) {
		super(controller, storage, facet, facetMeta);

		this.step = facet.step;

		const storedRange = this.storage.get(`${this.field}.range`);
		if (!storedRange || !facet.filtered) {
			this.storage.set(`${this.field}.range`, facet.range);
			this.range = facet.range;
		} else if (facet.range.low > storedRange.low || facet.range.high < storedRange.high) {
			// range from API has shrunk
			this.range = this.storage.get(`${this.field}.range`);
		} else if (facet.range.low < storedRange.low || facet.range.high > storedRange.high) {
			// range from API has grown
			// store bigger range
			this.storage.set(`${this.field}.range`, facet.range);
			this.range = facet.range;
		} else {
			// range hasn't changed
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

class ValueFacet extends Facet {
	values = [];

	search = {
		input: '',
	};

	multiple: string;

	overflow = {
		enabled: false,
		limited: true,
		limit: 0,
		remaining: undefined,
		setLimit: function (limit) {
			if (limit != this.limit) {
				this.enabled = true;
				this.limit = limit;
				this.calculate();
			}
		},
		toggle: (val) => {
			if (typeof val != 'undefined') {
				this.overflow.limited = val;
			} else {
				this.overflow.limited = !this.overflow.limited;
			}

			this.storage.set(`${this.field}.overflow.limited`, this.overflow.limited);

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

	constructor(controller, storage, facet, facetMeta) {
		super(controller, storage, facet, facetMeta);

		this.multiple = this.multiple;

		this.values =
			(facet.values &&
				facet.values.map((value) => {
					switch (facet.type) {
						case 'value':
							if (facetMeta.display === 'hierarchy') {
								const filteredValues = facet.values.filter((value) => value.filtered);
								return new HierarchyValue(controller, this, value, filteredValues);
							} else {
								return new Value(controller, this, value);
							}
						case 'range-buckets':
							return new RangeValue(controller, this, value);
					}
				})) ||
			[];

		const overflowLimitedState = this.storage.get(`${this.field}.overflow.limited`);

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

	get refinedValues() {
		let values = this.values || [];

		if (this.search.input) {
			const search = new RegExp(escapeRegExp(this.search.input), 'i');
			values = this.values.filter((value) => value.label.match(search));
		}

		if (this.overflow.enabled && this.overflow.limited) {
			values = values.slice(0, this.overflow.limit);
		}

		return values;
	}
}

class Value {
	private controller;
	label;
	count;
	filtered;
	value;
	custom;
	url;

	constructor(controller, facet, value) {
		this.controller = controller;
		Object.assign(this, value);

		if (this.filtered) {
			this.url = this.controller?.urlManager?.remove('page').remove(`filter.${facet.field}`, value.value);
		} else {
			let valueUrl = this.controller?.urlManager.remove('page');
			if (facet.multiple == 'single') {
				valueUrl = valueUrl?.remove(`filter.${facet.field}`);
			}
			this.url = valueUrl?.merge(`filter.${facet.field}`, value.value);
		}
	}
}

class HierarchyValue extends Value {
	level = 0;
	history = false;

	constructor(controller, facet, value, filteredValues) {
		super(controller, facet, value);

		if (value.value && facet.hierarchyDelimiter) {
			this.level = value.value.split(facet.hierarchyDelimiter).length;
		}

		if (facet.filtered && filteredValues?.length) {
			const filteredLevel = filteredValues[0].value.split(facet.hierarchyDelimiter).length;
			if (this.level <= filteredLevel) {
				this.history = true;
			}
		}

		if (value.value) {
			this.url = controller?.urlManager?.remove('page').set(`filter.${facet.field}`, value.value);
		} else {
			this.url = controller?.urlManager?.remove('page').remove(`filter.${facet.field}`);
		}
	}
}

class RangeValue {
	private controller;
	label;
	count;
	filtered;
	low;
	high;
	custom;
	url;

	constructor(controller, facet, value) {
		this.controller = controller;

		Object.assign(this, value);

		if (this.filtered) {
			this.url = this.controller?.urlManager.remove('page').remove(`filter.${facet.field}`, [{ low: this.low, high: this.high }]);
		} else {
			let valueUrl = this.controller?.urlManager.remove('page');

			if (facet.multiple == 'single') {
				valueUrl = valueUrl?.remove(`filter.${facet.field}`);
			}

			this.url = valueUrl?.merge(`filter.${facet.field}`, [{ low: this.low, high: this.high }]);
		}
	}
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
