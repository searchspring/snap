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
import type { HistoryStoreConfig } from './Stores/SearchHistoryStore';
import { AbstractStore } from '../Abstract/AbstractStore';
import { StorageStore } from '../Storage/StorageStore';

export class SearchStore extends AbstractStore {
	public services: StoreServices;
	public meta!: MetaResponseModel;
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

		const historyConfig: HistoryStoreConfig = {
			url: (this.config as SearchStoreConfig).settings?.history?.url,
			max: (this.config as SearchStoreConfig).settings?.history?.max,
		};

		if (this.config.globals?.siteId) {
			historyConfig.siteId = this.config.globals?.siteId;
		}

		this.history = new SearchHistoryStore(historyConfig, this.services);

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

	/*
	TODO: refactor sub-store interfaces
	
	interface StoreParameters {
		config?: StoreConfigs;
		services?: StoreServices;
		stores?: {
			storage?: StorageStore;
			state?: StateStore;
		};
		data?: SearchResponseModel & { meta: MetaResponseModel };
	}
	*/

	public reset(): void {
		this.update();
	}

	public update(data: SearchResponseModel & { meta?: MetaResponseModel } = {}): void {
		this.error = undefined;
		this.loaded = !!data.pagination;
		this.meta = data.meta || {};
		this.merchandising = new SearchMerchandisingStore(this.services, data?.merchandising || {});
		this.search = new SearchQueryStore(this.services, data?.search || {});
		this.facets = new SearchFacetStore(
			this.config,
			this.services,
			this.storage,
			data.facets,
			data?.pagination || {},
			this.meta,
			data?.merchandising || {}
		);
		this.filters = new SearchFilterStore(this.services, data.filters, this.meta);
		this.results = new SearchResultStore(this.config, this.services, this.meta, data?.results || [], data.pagination, data.merchandising);
		this.pagination = new SearchPaginationStore(this.config, this.services, data.pagination, this.meta);
		this.sorting = new SearchSortingStore(this.services, data?.sorting || [], data?.search || {}, this.meta);
	}
}
