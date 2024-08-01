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
	public config: RecommendationStoreConfig;

	constructor(config: RecommendationStoreConfig, services: StoreServices) {
		super();

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		this.config = config;
		this.services = services;

		this.reset();

		makeObservable(this, {
			profile: observable,
			results: observable,
		});
	}

	setConfig(newConfig: RecommendationStoreConfig): void {
		this.config = newConfig;
	}

	public reset(): void {
		this.update();
	}

	public update(data?: RecommendCombinedResponseModel & { meta?: MetaResponseModel }): void {
		this.error = undefined;
		this.meta = new MetaStore({
			data: {
				meta: data?.meta!,
			},
		});
		this.profile = new RecommendationProfileStore({
			data: {
				recommend: data!,
			},
		});
		this.results = new SearchResultStore({
			config: this.config,
			state: {
				loaded: this.loaded,
			},
			data: {
				search: {
					results: data?.results,
				},
				meta: this.meta.data,
			},
		}) as Product[];

		// only create a cart store when type is bundle
		if (this.profile.type == 'bundle') {
			this.cart = new CartStore();
		}

		this.loaded = !!data?.profile;
	}
}
