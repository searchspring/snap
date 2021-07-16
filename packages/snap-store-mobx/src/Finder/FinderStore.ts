import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { PaginationStore } from '../Search/Stores';
import { StorageStore } from '../Storage/StorageStore';
import { SelectionStore } from './Stores';
export class FinderStore extends AbstractStore {
	services;
	config;
	meta = {};
	storage: StorageStore;
	pagination: PaginationStore;
	selections: SelectionStore[];

	constructor(config, services: { urlManager: any }) {
		super();

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.config = config;
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

	update(data): void {
		this.loaded = !!data.pagination;
		this.meta = data.meta;
		this.pagination = new PaginationStore(this.services, data.pagination);
		this.selections = new SelectionStore(this.config, this.services, data.facets, this.meta, this.loading, this.storage);
	}
}
