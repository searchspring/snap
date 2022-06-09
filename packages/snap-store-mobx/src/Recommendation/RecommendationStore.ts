import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { ResultStore } from '../Search/Stores';
import { ProfileStore } from './Stores';
import type { RecommendationStoreConfig, StoreServices } from '../types';
import type { RecommendCombinedResponseModel } from '@searchspring/snap-client';

export class RecommendationStore extends AbstractStore {
	public services: StoreServices;
	public loaded = false;
	public profile!: ProfileStore;
	public results!: ResultStore;

	constructor(config: RecommendationStoreConfig, services: StoreServices) {
		super(config);

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.services = services;

		this.reset();

		makeObservable(this, {
			profile: observable,
			results: observable,
		});
	}

	public reset(): void {
		this.update();
	}

	public update(data?: RecommendCombinedResponseModel): void {
		this.error = undefined;
		this.loaded = !!data?.profile;
		this.profile = new ProfileStore(this.services, data);
		this.results = new ResultStore(this.config, this.services, data?.results);
	}
}
