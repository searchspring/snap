import { makeObservable, observable } from 'mobx';

import { MerchandisingStore, FacetStore, FilterStore, ResultStore, PaginationStore, SortingStore, QueryStore } from './Stores';
import { AbstractStore } from '../Abstract/AbstractStore';
import { StorageStore } from '../Storage/StorageStore';
export class SearchStore extends AbstractStore {
	config;
	services;
	public meta = {};
	public merchandising: MerchandisingStore;
	public search: QueryStore;
	public facets: FacetStore;
	public filters: FilterStore;
	public results: ResultStore;
	public pagination: PaginationStore;
	public sorting: SortingStore;
	public storage: StorageStore;

	constructor(config, services: { urlManager: any }) {
		super();

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to SearchStore. Missing "subscribe" function.`);
		}

		this.config = config;
		this.services = services;

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
		this.merchandising = new MerchandisingStore(this.services, data.merchandising);
		this.search = new QueryStore(this.services, data.search);
		this.facets = new FacetStore(this.services, this.storage, data.facets, this.meta);
		this.filters = new FilterStore(this.services, data.filters, this.meta);
		this.results = new ResultStore(this.services, data.results, data.pagination, data.merchandising);
		this.pagination = new PaginationStore(this.services, data.pagination);
		this.sorting = new SortingStore(this.services, data.sorting, data.search, this.meta);
	}
}
