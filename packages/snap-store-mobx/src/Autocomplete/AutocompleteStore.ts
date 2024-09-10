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

export class AutocompleteStore extends AbstractStore<AutocompleteStoreConfig> {
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

		this.state = new AutocompleteStateStore({
			services: this.services,
		});

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

	get hasQuery() {
		return Boolean((this.state.input && this.loaded) || this.search.query?.string);
	}

	public reset(): void {
		this.state.reset();
		this.update({ meta: {}, search: {} });
		this.resetTerms();
	}

	public initHistory(): void {
		const limit = this.config.settings?.history?.limit;
		if (limit) {
			const historyStore = new SearchHistoryStore({
				services: this.services,
				config: {
					id: this.config.id,
					globals: this.config.globals,
				},
			});

			this.history = new AutocompleteHistoryStore({
				services: this.services,
				functions: {
					resetTerms: () => {
						this.resetTerms();
					},
				},
				state: {
					autocomplete: this.state,
				},
				data: {
					queries: historyStore.getStoredData(limit),
				},
			});
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

	public updateTrendingTerms(trending: TrendingResponseModel): void {
		this.trending = new AutocompleteTrendingStore({
			services: this.services,
			functions: {
				resetTerms: () => {
					this.resetTerms();
				},
			},
			state: {
				autocomplete: this.state,
			},
			data: {
				trending,
			},
		});
	}

	public update(data: { meta: MetaResponseModel; search: AutocompleteResponseModel }): void {
		if (!data) return;
		const { meta, search } = data || {};
		this.error = undefined;
		this.meta = new MetaStore({
			data: { meta },
		});

		// set the query to match the actual queried term and not the input query
		if (search.search) {
			this.state.url = this.services.urlManager = this.services.urlManager.set('query', search.search.query);
		}

		// only run if we want to update the terms (not locked)
		if (!this.state.locks.terms.locked) {
			this.terms = new AutocompleteTermStore({
				config: this.config,
				services: this.services,
				functions: {
					resetTerms: () => {
						this.resetTerms();
					},
				},
				state: {
					autocomplete: this.state,
				},
				data: {
					autocomplete: search,
				},
			});

			// only lock if there was data
			search.autocomplete && this.state.locks.terms.lock();
		}

		this.merchandising = new SearchMerchandisingStore({
			data: {
				search,
			},
		});

		this.search = new AutocompleteQueryStore({
			config: this.config,
			services: this.services,
			data: {
				autocomplete: search,
			},
		});

		// only run if we want to update the facets (not locked)
		if (!this.state.locks.facets.locked) {
			this.facets = new AutocompleteFacetStore({
				config: this.config,
				services: this.services,
				stores: {
					storage: this.storage,
				},
				state: {
					autocomplete: this.state,
				},
				data: {
					search,
					meta: this.meta.data,
				},
			});
		}

		this.filters = new SearchFilterStore({
			services: this.services,
			data: {
				search,
				meta: this.meta.data,
			},
		});

		this.results = new SearchResultStore({
			config: this.config,
			state: {
				loaded: this.loaded,
			},
			data: {
				search,
				meta: this.meta.data,
			},
		});

		if ((this.results.length === 0 && !this.trending.filter((term) => term.active).length) || this.terms?.filter((term) => term.active).length) {
			// if a trending term was selected and then a subsequent search yields no results, reset trending terms to remove active state
			// OR if any terms are active, also reset to ensure only a single term or trending term is active
			this.resetTrending();
		}

		this.pagination = new SearchPaginationStore({
			services: this.services,
			data: {
				search,
				meta: this.meta.data,
			},
		});

		this.sorting = new SearchSortingStore({
			services: this.services,
			data: {
				search,
				meta: this.meta.data,
			},
		});

		this.loaded = Boolean(search?.pagination);
	}
}
