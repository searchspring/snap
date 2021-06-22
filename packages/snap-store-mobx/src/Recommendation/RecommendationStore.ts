import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { ResultStore } from '../Search/Stores';
import { ProfileStore } from './Stores';

export class RecommendationStore extends AbstractStore {
	services;
	loaded = false;
	profile: ProfileStore;
	results: ResultStore;

	constructor(config, services: { urlManager: any; tracker: any }) {
		super();

		if (typeof services != 'object' || typeof services.urlManager?.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to AutocompleteStore. Missing "subscribe" function.`);
		}

		if (typeof services != 'object' || typeof services.tracker?.track != 'object') {
			throw new Error(`Invalid service 'tracker' passed to controller. Missing "track" object.`);
		}

		this.services = services;

		this.reset();

		makeObservable(this, {
			profile: observable,
			results: observable,
		});
	}

	reset(): void {
		this.update({});
	}

	update(data): void {
		this.loaded = !!data.profile;
		this.profile = new ProfileStore(this.services, data.profile);
		this.results = new ResultStore(this.services, data.results);
	}
}
