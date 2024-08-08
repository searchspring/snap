import { makeObservable, observable } from 'mobx';

import type { SearchResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import type { SearchStoreConfig, StoreServices } from '../types';
import {
	SearchMerchandisingStore,
	SearchFacetStore,
	SearchFilterStore,
	SearchResultStore,
	SearchPaginationStore,
	SearchSortingStore,
	SearchQueryStore,
	SearchHistoryStore,
} from './Stores';
import { AbstractStore } from '../Abstract/AbstractStore';
import { StorageStore } from '../Storage/StorageStore';
import { MetaStore } from '../Meta/MetaStore';

export class SearchStore extends AbstractStore<SearchStoreConfig> {
	public services: StoreServices;
	public meta!: MetaStore;
	public merchandising!: SearchMerchandisingStore;
	public search!: SearchQueryStore;
	public facets!: SearchFacetStore;
	public filters!: SearchFilterStore;
	public results!: SearchResultStore;
	public pagination!: SearchPaginationStore;
	public sorting!: SearchSortingStore;
	public storage: StorageStore;
	public history: SearchHistoryStore;

	constructor(config: SearchStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to SearchStore. Missing "subscribe" function.`);
		}

		this.services = services;

		this.storage = new StorageStore();

		this.history = new SearchHistoryStore({
			services: this.services,
			config: this.config,
		});

		this.update();

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

	public reset(): void {
		this.update();
	}

	public update(data: SearchResponseModel & { meta?: MetaResponseModel } = {}): void {
		this.error = undefined;
		this.meta = new MetaStore({
			data: {
				meta: data.meta!,
			},
		});
		this.merchandising = new SearchMerchandisingStore({
			data: {
				search: data,
			},
		});

		this.search = new SearchQueryStore({
			services: this.services,
			data: {
				search: data,
			},
		});

		this.facets = new SearchFacetStore({
			config: this.config,
			services: this.services,
			stores: {
				storage: this.storage,
			},
			data: {
				search: data,
				meta: this.meta.data,
			},
		});

		this.filters = new SearchFilterStore({
			services: this.services,
			data: {
				search: data,
				meta: this.meta.data,
			},
		});

		this.results = new SearchResultStore({
			config: this.config,
			state: {
				loaded: this.loaded,
			},
			data: {
				search: data,
				meta: this.meta.data,
			},
		});

		this.pagination = new SearchPaginationStore({
			config: this.config,
			services: this.services,
			data: {
				search: data,
				meta: this.meta.data,
			},
		});

		this.sorting = new SearchSortingStore({
			services: this.services,
			data: {
				search: data,
				meta: this.meta.data,
			},
		});

		this.loaded = !!data.pagination;
	}
}
