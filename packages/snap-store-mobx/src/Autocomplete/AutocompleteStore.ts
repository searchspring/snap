import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { FilterStore, ResultStore, MerchandisingStore, PaginationStore, SortingStore } from '../Search/Stores';
import { StorageStore } from '../Storage/StorageStore';

import { StateStore, TermStore, QueryStore, FacetStore, TrendingStore } from './Stores';
export class AutocompleteStore extends AbstractStore {
	config;
	services;
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
	trending: TrendingStore;

	tabs: any = [];
	activeTab: string;

	constructor(config, services: { urlManager: any }) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		this.state = new StateStore(services);
		this.storage = new StorageStore();

		if (config.tabs?.length) {
			this.tabs = config.tabs;
			this.activeTab = this.tabs.filter((tab) => tab?.default)[0]?.id || this.tabs[0]?.id;
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
			tabs: observable,
			activeTab: observable,
		});
	}

	switchTabs(tab): void {
		this.activeTab = tab.id;
		// this.services.urlManager.set({ view: this.activeTab })
	}

	reset(): void {
		this.state.reset();
		this.update({ meta: this.meta });
		this.resetTrending();
	}

	resetTrending(): void {
		if (this.trending?.length) {
			this.trending.forEach((term) => {
				term.active = false;
			});
		}
	}

	setService(name, service): void {
		if (this.services[name] && service) {
			this.services[name] = service;
			if (name === 'urlManager') {
				this.state.url = service;
			}
		}
	}

	updateTrendingTerms(data): void {
		this.trending = new TrendingStore(this.services, data.trending, this.state);
	}

	update(data): void {
		this.loaded = !!data.pagination;
		this.meta = data.meta;

		// only run if we want to update the terms (not locked)
		if (!this.state.locks.terms.locked) {
			this.terms = new TermStore(this.services, data.autocomplete, data.pagination, this.state);
		}

		// set state url to match active term (used for setting from input text)
		const activeTerm = this.terms?.filter((term) => term.active)[0];
		if (activeTerm && this.state.term != activeTerm.value) {
			this.state.term = activeTerm.value;
			this.state.url = this.state.url.set('query', activeTerm.value);
		}

		this.merchandising = new MerchandisingStore(this.services, data.merchandising);
		this.search = new QueryStore(this.services, data.autocomplete, data.search);

		// only run if we want to update the facets (not locked)
		if (!this.state.locks.facets.locked) {
			this.facets = new FacetStore(this.config, this.services, this.storage, data.facets, data.pagination, this.meta, this.state);
		}

		this.filters = new FilterStore(this.services, data.filters, this.meta);
		this.results = new ResultStore(this.services, data.results, data.pagination, data.merchandising);

		if (this.results.length === 0) {
			// if a trending term was selected and then a subsequent search yields no results,
			// reset trending terms to remove active state
			this.resetTrending();
		}

		this.pagination = new PaginationStore({}, this.services, data.pagination);
		this.sorting = new SortingStore(this.services, data.sorting, data.search, this.meta);
	}
}
