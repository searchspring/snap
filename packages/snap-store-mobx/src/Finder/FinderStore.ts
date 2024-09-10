import { makeObservable, observable } from 'mobx';

import type { SearchResponseModel, MetaResponseModel } from '@searchspring/snapi-types';
import { AbstractStore } from '../Abstract/AbstractStore';
import { SearchPaginationStore } from '../Search/Stores';
import { StorageStore } from '../Storage/StorageStore';
import { FinderSelectionStore } from './Stores';
import type { FinderStoreConfig, StoreServices, SelectedSelection } from '../types';
import { UrlManager } from '@searchspring/snap-url-manager';
import { MetaStore } from '../Meta/MetaStore';

export class FinderStore extends AbstractStore<FinderStoreConfig> {
	public services: StoreServices;
	public meta!: MetaStore;
	public storage: StorageStore;
	public persistedStorage!: StorageStore;
	public pagination!: SearchPaginationStore;
	public selections!: FinderSelectionStore;
	public persisted: boolean = false;

	constructor(config: FinderStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		if (this.config.persist?.enabled) {
			this.persistedStorage = new StorageStore({
				type: 'local',
				key: `ss-${this.config.id}-persisted`,
			});
		}

		this.storage = new StorageStore();

		this.update({ meta: {}, search: {} });

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

	// providing access to response data without exposing it
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public save: () => void = () => {};

	public reset = (): void => {
		if (this.config.persist?.enabled) {
			this.persistedStorage?.clear();
			this.persisted = false;
		}

		if (this.services.urlManager.state.filter) {
			this.storage.clear();
			this.selections = [];
			this.loaded = false;
		}
	};

	public loadPersisted(): void {
		if (this.config.persist?.enabled && this.persistedStorage) {
			const date = this.persistedStorage.get('date');
			const data = this.persistedStorage.get('data');
			const config = this.persistedStorage.get('config');
			const selections = this.persistedStorage.get('selections');
			const isExpired = this.config.persist.expiration && Date.now() - date > this.config.persist.expiration;

			if (data && selections.filter((selection: SelectedSelection) => selection.selected).length) {
				// stringify config without middleware and plugins (they may be using variable data)
				const stringifiedPersistedConfig = JSON.stringify({ ...config, plugins: [], middleware: {} });
				const stringifiedConfig = JSON.stringify({ ...this.config, plugins: [], middleware: {} });

				// if the config has not changed and the data is not expired then persist
				if (stringifiedPersistedConfig === stringifiedConfig && !isExpired) {
					this.update(data, selections);
					this.persisted = true;
					this.services.urlManager.go();
				} else {
					this.reset();
				}
			}
		}
	}

	public update(data: { meta: MetaResponseModel; search: SearchResponseModel }, selectedSelections?: SelectedSelection[]): void {
		const { meta, search } = data || {};
		this.error = undefined;
		this.loaded = Boolean(search?.pagination);
		this.meta = new MetaStore({
			data: { meta },
		});
		this.pagination = new SearchPaginationStore({
			config: this.config,
			services: this.services,
			data: {
				search,
				meta: this.meta.data,
			},
		});

		this.selections = new FinderSelectionStore({
			config: this.config,
			services: this.services,
			stores: {
				storage: this.storage,
			},
			state: {
				persisted: this.persisted,
				loading: this.loading,
			},
			data: {
				search,
				meta: this.meta.data,
				selections: selectedSelections || [],
			},
		});

		// providing access to response data without exposing it
		this.save = () => {
			if (this.config.persist?.enabled && this.persistedStorage && this?.selections?.filter((selection) => selection.selected).length) {
				this.persistedStorage.set('config', this.config);
				this.persistedStorage.set('data', search);
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
		};
	}
}
