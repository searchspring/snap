import { makeObservable, observable } from 'mobx';

import { UrlManager } from '@searchspring/snap-url-manager';
import { AbstractStore } from '../Abstract/AbstractStore';
import {
	SearchFilterStore,
	SearchResultStore,
	SearchMerchandisingStore,
	SearchPaginationStore,
	SearchSortingStore,
	SearchHistoryStore,
} from '../Search/Stores';
import { StorageStore } from '../Storage/StorageStore';
import {
	AutocompleteStateStore,
	AutocompleteTermStore,
	AutocompleteQueryStore,
	AutocompleteFacetStore,
	AutocompleteTrendingStore,
	AutocompleteHistoryStore,
} from './Stores';

import type { AutocompleteResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import type { TrendingResponseModel } from '@searchspring/snap-client';
import type { AutocompleteStoreConfig, StoreServices } from '../types';
import { MetaStore } from '../Meta/MetaStore';

export class AutocompleteStore extends AbstractStore {
	public services: StoreServices;
	public meta!: MetaStore;
	public merchandising!: SearchMerchandisingStore;
	public search!: AutocompleteQueryStore;
	public terms!: AutocompleteTermStore;
	public facets!: AutocompleteFacetStore;
	public filters!: SearchFilterStore;
	public results!: SearchResultStore;
	public pagination!: SearchPaginationStore;
	public sorting!: SearchSortingStore;
	public state: AutocompleteStateStore;
	public storage: StorageStore;
	public trending: AutocompleteTrendingStore;
	public history: AutocompleteHistoryStore;

	constructor(config: AutocompleteStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		this.state = new AutocompleteStateStore(services);

		this.storage = new StorageStore();

		this.trending = [];
		this.history = [];
		this.initHistory();

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
			history: observable,
		});
	}

	public reset(): void {
		this.state.reset();
		this.update();
		this.resetTerms();
	}

	public initHistory(): void {
		const limit = (this.config as AutocompleteStoreConfig).settings?.history?.limit;
		if (limit) {
			const historyStore = new SearchHistoryStore({ siteId: this.config.globals?.siteId! }, this.services);

			this.history = new AutocompleteHistoryStore(
				this.services,
				historyStore.getStoredData(limit),
				() => {
					this.resetTerms();
				},
				this.state
			);
		}
	}

	public resetTerms(): void {
		this.resetSuggestions();
		this.resetTrending();
		this.resetHistory();
	}

	public resetSuggestions(): void {
		this.terms?.forEach((term) => (term.active = false));
	}

	public resetTrending(): void {
		this.trending?.forEach((term) => (term.active = false));
	}

	public resetHistory(): void {
		this.history?.forEach((term) => (term.active = false));
	}

	public setService(name: keyof StoreServices, service: UrlManager): void {
		if (this.services[name] && service) {
			this.services[name] = service;
			if (name === 'urlManager') {
				this.state.url = service;
				this.initHistory();
			}
		}
	}

	public updateTrendingTerms(data: TrendingResponseModel): void {
		this.trending = new AutocompleteTrendingStore(
			this.services,
			data,
			() => {
				this.resetTerms();
			},
			this.state
		);
	}

	public update(data: AutocompleteResponseModel & { meta?: MetaResponseModel } = {}): void {
		if (!data) return;
		this.error = undefined;
		this.meta = new MetaStore(data.meta);

		// set the query to match the actual queried term and not the input query
		if (data.search) {
			this.state.url = this.services.urlManager = this.services.urlManager.set('query', data.search.query);
		}

		// only run if we want to update the terms (not locked)
		if (!this.state.locks.terms.locked) {
			this.terms = new AutocompleteTermStore(
				this.services,
				data.autocomplete || {},
				data.pagination || {},
				data.search || {},
				() => {
					this.resetTerms();
				},
				this.state,
				this.config as AutocompleteStoreConfig
			);

			// only lock if there was data
			data.autocomplete && this.state.locks.terms.lock();
		}

		this.merchandising = new SearchMerchandisingStore(this.services, data.merchandising || {});

		this.search = new AutocompleteQueryStore(this.services, data.autocomplete || {}, data.search || {}, this.config as AutocompleteStoreConfig);

		// only run if we want to update the facets (not locked)
		if (!this.state.locks.facets.locked) {
			this.facets = new AutocompleteFacetStore(
				this.config,
				this.services,
				this.storage,
				data.facets || [],
				data.pagination || {},
				this.meta.data,
				this.state,
				data.merchandising || {}
			);
		}

		this.filters = new SearchFilterStore(this.services, data.filters, this.meta.data);
		this.results = new SearchResultStore(
			this.config,
			this.services,
			this.meta.data,
			data.results || [],
			data.pagination,
			data.merchandising,
			this.loaded
		);

		if ((this.results.length === 0 && !this.trending.filter((term) => term.active).length) || this.terms?.filter((term) => term.active).length) {
			// if a trending term was selected and then a subsequent search yields no results, reset trending terms to remove active state
			// OR if any terms are active, also reset to ensure only a single term or trending term is active
			this.resetTrending();
		}

		this.pagination = new SearchPaginationStore(this.config, this.services, data.pagination, this.meta.data);
		this.sorting = new SearchSortingStore(this.services, data.sorting || [], data.search || {}, this.meta.data);

		this.loaded = !!data.pagination;
	}
}
