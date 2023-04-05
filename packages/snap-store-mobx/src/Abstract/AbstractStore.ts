import { makeObservable, observable, toJS } from 'mobx';
import type { StoreConfigs, ErrorType } from '../types';
export abstract class AbstractStore {
	public custom = {};
	public loading = false;
	public loaded = false;
	public error:
		| {
				code?: number;
				type?: ErrorType;
				message?: string;
		  }
		| undefined;
	public config: StoreConfigs;

	constructor(config: StoreConfigs) {
		this.config = config;

		makeObservable(this, {
			custom: observable,
			loading: observable,
			loaded: observable,
		});
	}

	setConfig(newConfig: StoreConfigs): void {
		this.config = newConfig;
	}

	abstract update(data: any): void;

	toJSON(thing = this) {
		// TODO: make this work better
		return toJS(thing);
	}
}
