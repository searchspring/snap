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

	constructor(config: FinderStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		if (config.persist) {
			this.persistedStorage = new StorageStore({
				type: StorageType.LOCAL,
				key: `${config.id}-persisted`,
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
		if (this.config.persist && this.selections.filter((selection) => selection.selected).length) {
			this.persistedStorage.set('data', this.data);
			this.persistedStorage.set(
				'selections',
				this.selections.map((selection, index) => {
					return {
						config: this.config,
						// field: selection.field,
						selected: selection.selected,
						// index,
						isHierarchy: Boolean(selection?.hierarchyDelimiter),
						// values: selection.values,
						// data: selection.data,
						// type: selection.type,
						facet: selection.facet,
					};
				})
			);
		}
	}

	reset = (): void => {
		if (this.config.persist) {
			this.persistedStorage.clear();
		}
		this.selections = [];
		this.loaded = false;
		this.services.urlManager.remove('filter').go();
	};

	loadPersisted(): boolean {
		if (this.config.persist && !this.loaded) {
			const data = this.persistedStorage.get('data');
			const selections = this.persistedStorage.get('selections');
			if (data && selections.filter((selection) => selection.selected).length) {
				if (JSON.stringify(selections[0]?.config) === JSON.stringify(this.config)) {
					this.update(data, selections);
					// this.services.urlManager.go();
					return true;
				}
				this.reset();
			}
		}
		return false;
	}

	update(data: SearchResponseModel & { meta: MetaResponseModel }, selectedSelections?: SelectedSelection[]): void {
		this.error = undefined;
		this.data = JSON.parse(JSON.stringify(data));
		this.loaded = !!data.pagination;
		this.meta = data.meta;
		this.pagination = new PaginationStore(this.config, this.services, data.pagination);
		this.selections = new SelectionStore(this.config, this.services, data.facets, this.meta, this.loading, this.storage, selectedSelections);
	}
}
