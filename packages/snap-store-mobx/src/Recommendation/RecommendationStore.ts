import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { Product, SearchResultStore } from '../Search/Stores';
import { CartStore } from '../Cart/CartStore';
import { RecommendationProfileStore } from './Stores';
import type { RecommendationStoreConfig, StoreServices } from '../types';
import type { RecommendCombinedResponseModel } from '@searchspring/snap-client';
import { MetaResponseModel } from '@searchspring/snapi-types';
import { MetaStore } from '../Meta/MetaStore';

export class RecommendationStore extends AbstractStore {
	public services: StoreServices;
	public meta!: MetaStore;
	public loaded = false;
	public profile!: RecommendationProfileStore;
	public results!: Product[];
	public cart!: CartStore;

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

	public update(data?: RecommendCombinedResponseModel & { meta?: MetaResponseModel }): void {
		this.error = undefined;
		this.loaded = !!data?.profile;
		this.meta = new MetaStore(data?.meta);
		this.profile = new RecommendationProfileStore(this.services, data);
		this.results = new SearchResultStore(this.config, this.services, this.meta.data, data?.results) as Product[];

		// only create a cart store when type is bundle
		if (this.profile.type == 'bundle') {
			this.cart = new CartStore();
		}
	}
}
