import { makeObservable, observable } from 'mobx';

import type { SearchResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import { AbstractStore } from '../Abstract/AbstractStore';
import { PaginationStore } from '../Search/Stores';
import { StorageStore, StorageType } from '../Storage/StorageStore';
import { SelectionStore } from './Stores';
import type { FinderStoreConfig, StoreServices, SelectedSelection } from '../types';

export class FinderStore extends AbstractStore {
	services: StoreServices;
	config: FinderStoreConfig;
	data: SearchResponseModel & { meta: MetaResponseModel };
	meta: MetaResponseModel = {};
	storage: StorageStore;
	persistedStorage: StorageStore;
	pagination: PaginationStore;
	selections: SelectionStore;
	state = {
		persisted: false,
	};

	constructor(config: FinderStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		if (config.persist?.enabled) {
			this.persistedStorage = new StorageStore({
				type: StorageType.LOCAL,
				key: `ss-${config.id}-persisted`,
			});
		}

		this.storage = new StorageStore();

		this.update({ meta: {} });

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

	save(): void {
		if (this.config.persist?.enabled && this.selections.filter((selection) => selection.selected).length) {
			this.persistedStorage.set('config', this.config);
			this.persistedStorage.set('data', this.data);
			this.persistedStorage.set('date', Date.now());
			this.persistedStorage.set(
				'selections',
				this.selections.map((selection, index) => {
					return {
						selected: selection.selected,
						data: selection.data,
						facet: selection.facet,
					};
				})
			);
		}
	}

	reset = (): void => {
		if (this.config.persist?.enabled) {
			this.persistedStorage.clear();
			this.state.persisted = false;
		}

		if (this.services.urlManager.state.filter) {
			this.storage.clear();
			this.selections = [];
			this.loaded = false;
		}
	};

	loadPersisted(): void {
		if (this.config.persist?.enabled && !this.loaded) {
			const date = this.persistedStorage.get('date');
			const data = this.persistedStorage.get('data');
			const config = this.persistedStorage.get('config');
			const selections = this.persistedStorage.get('selections');
			const isExpired = this.config.persist.expiration && Date.now() - date > this.config.persist.expiration;

			if (data && selections.filter((selection) => selection.selected).length) {
				if (JSON.stringify(config) === JSON.stringify(this.config) && !isExpired) {
					this.update(data, selections);
					this.state.persisted = true;
					this.services.urlManager.go();
				} else {
					this.reset();
				}
			}
		}
	}

	update(data: SearchResponseModel & { meta: MetaResponseModel }, selectedSelections?: SelectedSelection[]): void {
		this.error = undefined;
		this.data = JSON.parse(JSON.stringify(data));
		this.loaded = !!data.pagination;
		this.meta = data.meta;
		this.pagination = new PaginationStore(this.config, this.services, data.pagination);
		this.selections = new SelectionStore(this.config, this.services, {
			state: this.state,
			facets: data.facets,
			meta: this.meta,
			loading: this.loading,
			storage: this.storage,
			selections: selectedSelections,
		});
	}
}
