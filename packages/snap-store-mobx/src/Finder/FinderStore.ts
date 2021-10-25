import { makeObservable, observable } from 'mobx';

import type { SearchResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import { AbstractStore } from '../Abstract/AbstractStore';
import { PaginationStore } from '../Search/Stores';
import { StorageStore } from '../Storage/StorageStore';
import { SelectionStore } from './Stores';
import type { FinderStoreConfig, StoreServices } from '../types';

export class FinderStore extends AbstractStore {
	services: StoreServices;
	config: FinderStoreConfig;
	meta: MetaResponseModel = {};
	storage: StorageStore;
	pagination: PaginationStore;
	selections: SelectionStore;

	constructor(config: FinderStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		this.storage = new StorageStore();

		this.update({ meta: {}, selections: [] });

		makeObservable(this, {
			selections: observable,
			pagination: observable,
		});
	}

	setService(name, service): void {
		if (this.services[name] && service) {
			this.services[name] = service;
		}
	}

	update(data: SearchResponseModel & { meta: MetaResponseModel; selections: SelectionStore[] }): void {
		this.error = undefined;
		this.loaded = !!data.pagination;
		this.meta = data.meta;
		this.pagination = new PaginationStore(this.config, this.services, data.pagination);
		this.selections = new SelectionStore(this.config, this.services, data.facets, this.meta, this.loading, this.storage);
	}
}
