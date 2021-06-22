import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { ResultStore } from '../Search/Stores';
import { ProfileStore } from './Stores';

export class RecommendationStore extends AbstractStore {
	controller;
	loaded = false;
	profile: ProfileStore;
	results: ResultStore;

	constructor() {
		super();

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
		this.profile = new ProfileStore(this.controller, data.profile);
		this.results = new ResultStore(this.controller, data.results);
	}
}
