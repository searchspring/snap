import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { Product, SearchResultStore } from '../Search/Stores';
import { CartStore } from '../Cart/CartStore';
import { RecommendationProfileStore } from './Stores';
import type { RecommendationStoreConfig, StoreServices } from '../types';
import type { ProfileResponseModel, RecommendResponseModel } from '@searchspring/snap-client';
import { MetaResponseModel } from '@searchspring/snapi-types';
import { MetaStore } from '../Meta/MetaStore';

export class RecommendationStore extends AbstractStore<RecommendationStoreConfig> {
	public services: StoreServices;
	public meta!: MetaStore;
	public loaded = false;
	public profile!: RecommendationProfileStore | Record<string, any>;
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
		this.error = undefined;
		this.loaded = false;
		this.profile = {};
		this.results = [];
	}

	public update(data: { meta: MetaResponseModel; profile: ProfileResponseModel; recommend: RecommendResponseModel }): void {
		const { meta, profile, recommend } = data || {};

		this.error = undefined;
		this.meta = new MetaStore({
			data: {
				meta,
			},
		});
		this.profile = new RecommendationProfileStore({
			data: {
				profile,
			},
		});
		this.results = new SearchResultStore({
			config: this.config,
			state: {
				loaded: this.loaded,
			},
			data: {
				search: {
					results: recommend.results,
				},
				meta: this.meta.data,
			},
		}) as Product[];

		// only create a cart store when type is bundle
		if (this.profile.type == 'bundle') {
			this.cart = new CartStore();
		}

		this.loaded = !!profile;
	}
}
