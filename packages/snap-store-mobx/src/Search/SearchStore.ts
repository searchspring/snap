import { makeObservable, observable } from 'mobx';

import { MerchandisingStore, FacetStore, FilterStore, ResultStore, PaginationStore, SortingStore, QueryStore } from './Stores';
import { AbstractStore } from '../Abstract/AbstractStore';
import { StorageStore } from '../Storage/StorageStore';
export class SearchStore extends AbstractStore {
	public meta = {};
	public merchandising: MerchandisingStore;
	public search: QueryStore;
	public facets: FacetStore;
	public filters: FilterStore;
	public results: ResultStore;
	public pagination: PaginationStore;
	public sorting: SortingStore;
	public storage: StorageStore;

	constructor() {
		super();

		this.storage = new StorageStore();
		this.update({ meta: this.meta });

		makeObservable(this, {
			search: observable,
			merchandising: observable,
			facets: observable,
			filters: observable,
			results: observable,
			pagination: observable,
			sorting: observable,
		});
	}

	update(data): void {
		this.loaded = !!data.pagination;
		this.meta = data.meta;
		this.merchandising = new MerchandisingStore(this.controller, data.merchandising);
		this.search = new QueryStore(this.controller, data.search);
		this.facets = new FacetStore(this.controller, this.storage, data.facets, this.meta);
		this.filters = new FilterStore(this.controller, data.filters, this.meta);
		this.results = new ResultStore(this.controller, data.results, data.pagination, data.merchandising);
		this.pagination = new PaginationStore(this.controller, data.pagination);
		this.sorting = new SortingStore(this.controller, data.sorting, data.search, this.meta);
	}
}
