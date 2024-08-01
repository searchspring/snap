import { makeObservable, observable, toJS } from 'mobx';
import type { ErrorType } from '../types';
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

	constructor() {
		makeObservable(this, {
			custom: observable,
			loading: observable,
			loaded: observable,
		});
	}

	abstract update(data: any): void;

	toJSON(thing = this) {
		// TODO: make this work better
		return toJS(thing);
	}
}
