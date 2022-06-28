import { makeObservable, observable } from 'mobx';

import type { SearchResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import { AbstractStore } from '../Abstract/AbstractStore';
import { SearchPaginationStore } from '../Search/Stores';
import { StorageStore, StorageType } from '../Storage/StorageStore';
import { FinderSelectionStore } from './Stores';
import type { FinderStoreConfig, StoreServices, SelectedSelection, FinderStoreState } from '../types';
import { UrlManager } from '@searchspring/snap-url-manager';

export class FinderStore extends AbstractStore {
	public services: StoreServices;
	public config!: FinderStoreConfig;
	public data!: SearchResponseModel & { meta: MetaResponseModel };
	public meta: MetaResponseModel = {};
	public storage: StorageStore;
	public persistedStorage!: StorageStore;
	public pagination!: SearchPaginationStore;
	public selections!: FinderSelectionStore;
	public state: FinderStoreState = {
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

	public setService(name: keyof StoreServices, service: UrlManager): void {
		if (this.services[name] && service) {
			this.services[name] = service;
		}
	}

	public save(): void {
		if (this.config.persist?.enabled && this.persistedStorage && this?.selections?.filter((selection) => selection.selected).length) {
			this.persistedStorage.set('config', this.config);
			this.persistedStorage.set('data', this.data);
			this.persistedStorage.set('date', Date.now());
			this.persistedStorage.set(
				'selections',
				this.selections.map((selection) => {
					return {
						selected: selection.selected,
						data: selection.data,
						facet: selection.facet,
					} as SelectedSelection;
				})
			);
		}
	}

	public reset = (): void => {
		if (this.config.persist?.enabled) {
			this.persistedStorage?.clear();
			this.state.persisted = false;
		}

		if (this.services.urlManager.state.filter) {
			this.storage.clear();
			this.selections = [];
			this.loaded = false;
		}
	};

	public loadPersisted(): void {
		if (this.config.persist?.enabled && this.persistedStorage && !this.loaded) {
			const date = this.persistedStorage.get('date');
			const data = this.persistedStorage.get('data');
			const config = this.persistedStorage.get('config');
			const selections = this.persistedStorage.get('selections');
			const isExpired = this.config.persist.expiration && Date.now() - date > this.config.persist.expiration;

			if (data && selections.filter((selection: SelectedSelection) => selection.selected).length) {
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

	public update(data: SearchResponseModel & { meta: MetaResponseModel }, selectedSelections?: SelectedSelection[]): void {
		this.error = undefined;
		this.data = JSON.parse(JSON.stringify(data));
		this.loaded = !!data.pagination;
		this.meta = data.meta;
		this.pagination = new SearchPaginationStore(this.config, this.services, data.pagination);
		this.selections = new FinderSelectionStore(this.config, this.services, {
			state: this.state,
			facets: data.facets || [],
			meta: this.meta,
			loading: this.loading,
			storage: this.storage,
			selections: selectedSelections || [],
		});
	}
}
