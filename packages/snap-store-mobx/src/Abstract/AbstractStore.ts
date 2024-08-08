import { makeObservable, observable, toJS } from 'mobx';
import type { StoreConfig, ErrorType } from '../types';
export abstract class AbstractStore<Type = StoreConfig> {
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
	public config: Type;

	constructor(config: Type) {
		this.config = config;

		makeObservable(this, {
			custom: observable,
			loading: observable,
			loaded: observable,
		});
	}

	setConfig(newConfig: Type): void {
		this.config = newConfig;
	}

	abstract update(data: any): void;

	toJSON(thing = this) {
		// TODO: make this work better
		return toJS(thing);
	}
}
