import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { FilterStore, ResultStore, MerchandisingStore, PaginationStore, SortingStore } from '../Search/Stores';
import { StorageStore } from '../Storage/StorageStore';

import { StateStore, TermStore, QueryStore, FacetStore } from './Stores';
export class AutocompleteStore extends AbstractStore {
	controller;
	meta = {};

	merchandising: MerchandisingStore;
	search: QueryStore;
	terms: TermStore;
	facets: FacetStore;
	filters: FilterStore;
	results: ResultStore;
	pagination: PaginationStore;
	sorting: SortingStore;
	state: StateStore;
	storage: StorageStore;

	constructor() {
		super();

		this.state = new StateStore();
		this.storage = new StorageStore();

		this.reset();

		makeObservable(this, {
			state: observable,
			search: observable,
			terms: observable,
			facets: observable,
			filters: observable,
			merchandising: observable,
			results: observable,
			pagination: observable,
			sorting: observable,
		});
	}

	link(controller): void {
		this.controller = controller;
		this.state.link(controller);
	}

	reset(): void {
		this.state.locks.terms.reset();
		this.state.locks.facets.reset();
		this.update({ meta: this.meta });
	}

	update(data): void {
		this.loaded = !!data.pagination;
		this.meta = data.meta;
		this.merchandising = new MerchandisingStore(this.controller, data.merchandising);
		this.search = new QueryStore(this.controller, data.autocomplete, data.search);

		// only run if we want to update the facets (not locked)
		if (!this.state.locks.facets.locked) {
			this.facets = new FacetStore(this.controller, this.storage, data.facets, this.meta, this.state);
		}

		this.filters = new FilterStore(this.controller, data.filters, this.meta);
		this.results = new ResultStore(this.controller, data.results, data.pagination, data.merchandising);

		// only run if we want to update the terms (not locked)
		if (!this.state.locks.terms.locked) {
			this.terms = new TermStore(this.controller, data.autocomplete, data.pagination, this.state);
		}

		this.pagination = new PaginationStore(this.controller, data.pagination);
		this.sorting = new SortingStore(this.controller, data.sorting, data.search, this.meta);
	}
}
