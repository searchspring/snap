import { makeObservable, observable } from 'mobx';

import { UrlManager } from '@searchspring/snap-url-manager';
import { AbstractStore } from '../Abstract/AbstractStore';
import { FilterStore, ResultStore, MerchandisingStore, PaginationStore, SortingStore } from '../Search/Stores';
import { StorageStore } from '../Storage/StorageStore';
import { StateStore, TermStore, QueryStore, FacetStore, TrendingStore } from './Stores';

import type { AutocompleteResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import type { TrendingResponseModel } from '@searchspring/snap-client';
import type { AutocompleteStoreConfig, StoreServices } from '../types';

export class AutocompleteStore extends AbstractStore {
	public services: StoreServices;
	public meta?: MetaResponseModel;
	public merchandising?: MerchandisingStore;
	public search?: QueryStore;
	public terms?: TermStore;
	public facets?: FacetStore;
	public filters?: FilterStore;
	public results?: ResultStore;
	public pagination?: PaginationStore;
	public sorting?: SortingStore;
	public state: StateStore;
	public storage: StorageStore;
	public trending: TrendingStore;

	constructor(config: AutocompleteStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		this.state = new StateStore(services);
		this.storage = new StorageStore();
		this.trending = [];

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

	reset(): void {
		this.state.reset();
		this.update();
		this.resetTrending();
	}

	resetTrending(): void {
		if (this.trending?.length) {
			this.trending.forEach((term) => {
				term.active = false;
			});
		}
	}

	resetTerms(): void {
		this.terms?.forEach((term) => {
			term.active = false;
		});
	}

	setService(name: keyof StoreServices, service: UrlManager): void {
		if (this.services[name] && service) {
			this.services[name] = service;
			if (name === 'urlManager') {
				this.state.url = service;
			}
		}
	}

	updateTrendingTerms(data: TrendingResponseModel): void {
		this.trending = new TrendingStore(
			this.services,
			data,
			() => {
				this.resetTerms();
			},
			this.state
		);
	}

	update(data: AutocompleteResponseModel & { meta?: MetaResponseModel } = {}): void {
		if (!data) return;
		this.error = undefined;
		this.loaded = !!data.pagination;
		this.meta = data.meta || {};

		// set the query to match the actual queried term and not the input query
		if (data.search) {
			this.state.url = this.services.urlManager = this.services.urlManager.set('query', data.search.query);
		}

		// only run if we want to update the terms (not locked)
		if (!this.state.locks.terms.locked) {
			this.terms = new TermStore(
				this.services,
				data.autocomplete || {},
				data.pagination || {},
				() => {
					this.resetTrending();
				},
				this.state
			);

			// only lock if there was data
			data.autocomplete && this.state.locks.terms.lock();
		}

		this.merchandising = new MerchandisingStore(this.services, data.merchandising || {});
		this.search = new QueryStore(this.services, data.autocomplete || {}, data.search || {});

		// only run if we want to update the facets (not locked)
		if (!this.state.locks.facets.locked) {
			this.facets = new FacetStore(this.config, this.services, this.storage, data.facets || [], data.pagination || {}, this.meta, this.state);
		}

		this.filters = new FilterStore(this.services, data.filters, this.meta);
		this.results = new ResultStore(this.config, this.services, data.results || [], data.pagination, data.merchandising);

		if ((this.results.length === 0 && !this.trending.filter((term) => term.active).length) || this.terms?.filter((term) => term.active).length) {
			// if a trending term was selected and then a subsequent search yields no results, reset trending terms to remove active state
			// OR if any terms are active, also reset to ensure only a single term or trending term is active
			this.resetTrending();
		}

		this.pagination = new PaginationStore(this.config, this.services, data.pagination);
		this.sorting = new SortingStore(this.services, data.sorting || [], data.search || {}, this.meta);
	}
}
