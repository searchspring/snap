import { makeObservable, observable } from 'mobx';

import { UrlManager } from '@searchspring/snap-url-manager';
import { AbstractStore } from '../Abstract/AbstractStore';
import { SearchFilterStore, SearchResultStore, SearchMerchandisingStore, SearchPaginationStore, SearchSortingStore } from '../Search/Stores';
import { StorageStore, StorageType } from '../Storage/StorageStore';
import { AutocompleteStateStore, AutocompleteTermStore, AutocompleteQueryStore, AutocompleteFacetStore, AutocompleteTrendingStore } from './Stores';

import type { AutocompleteResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import type { TrendingResponseModel } from '@searchspring/snap-client';
import type { AutocompleteStoreConfig, StoreServices } from '../types';
import { AutocompleteHistoryStore } from './Stores/AutocompleteHistoryStore';

export class AutocompleteStore extends AbstractStore {
	public services: StoreServices;
	public meta!: MetaResponseModel;
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
	public localStorage: StorageStore;
	public trending: AutocompleteTrendingStore;
	public history: AutocompleteHistoryStore;

	constructor(config: AutocompleteStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		this.state = new AutocompleteStateStore(services);

		//note we want facets stored in memory (default storageStore type)
		this.storage = new StorageStore();
		//but we want history stored in local storage
		this.localStorage = new StorageStore({
			type: StorageType.LOCAL,
			key: `ss-controller-${this.config.id}`,
		});

		this.trending = [];
		this.history = [];
		if (config.settings?.history?.limit) {
			this.history = new AutocompleteHistoryStore(
				services,
				this.storedHistory,
				() => {
					this.resetHistory();
				},
				this.state
			);
		}

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

	get storedHistory(): any {
		const storedHistory = this.localStorage.get('history');
		if (storedHistory) {
			return JSON.parse(storedHistory);
		} else {
			return [];
		}
	}

	public reset(): void {
		this.state.reset();
		this.update();
		this.resetTrending();
		this.resetHistory();
		this.resetTerms();
	}

	public resetTrending(): void {
		if (this.trending?.length) {
			this.trending.forEach((term) => {
				term.active = false;
			});
		}
	}

	public resetHistory(): void {
		if (this.history && this.history?.length) {
			this.history.forEach((term) => {
				term.active = false;
			});
		}
	}

	public resetTerms(): void {
		this.terms?.forEach((term) => {
			term.active = false;
		});
	}

	public saveToHistory(term: string, passedLimit: number) {
		let history = this.storedHistory;
		const index = history.indexOf(term);
		if (index != -1) {
			history.splice(index, 1);
		}
		history = ([] as string[]).concat(term, history);
		const limit = passedLimit || 5;
		if (history.length > limit) {
			history.pop();
		}
		this.localStorage.set('history', JSON.stringify(history));
	}

	public setService(name: keyof StoreServices, service: UrlManager): void {
		if (this.services[name] && service) {
			this.services[name] = service;
			if (name === 'urlManager') {
				this.state.url = service;
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
		this.loaded = !!data.pagination;
		this.meta = data.meta || {};

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
				() => {
					this.resetTrending();
				},
				this.state
			);

			// only lock if there was data
			data.autocomplete && this.state.locks.terms.lock();
		}

		this.merchandising = new SearchMerchandisingStore(this.services, data.merchandising || {});
		this.search = new AutocompleteQueryStore(this.services, data.autocomplete || {}, data.search || {});

		// only run if we want to update the facets (not locked)
		if (!this.state.locks.facets.locked) {
			this.facets = new AutocompleteFacetStore(
				this.config,
				this.services,
				this.storage,
				data.facets || [],
				data.pagination || {},
				this.meta,
				this.state,
				data.merchandising || {}
			);
		}

		this.filters = new SearchFilterStore(this.services, data.filters, this.meta);
		this.results = new SearchResultStore(this.config, this.services, data.results || [], data.pagination, data.merchandising);

		if ((this.results.length === 0 && !this.trending.filter((term) => term.active).length) || this.terms?.filter((term) => term.active).length) {
			// if a trending term was selected and then a subsequent search yields no results, reset trending terms to remove active state
			// OR if any terms are active, also reset to ensure only a single term or trending term is active
			this.resetTrending();
		}

		this.pagination = new SearchPaginationStore(this.config, this.services, data.pagination, this.meta);
		this.sorting = new SearchSortingStore(this.services, data.sorting || [], data.search || {}, this.meta);
	}
}
