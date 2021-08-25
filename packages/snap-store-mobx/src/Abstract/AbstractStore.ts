import { makeObservable, observable, toJS, configure } from 'mobx';

configure({
	// useProxies: "never",  // for IE 11 (es5) support
	enforceActions: 'never',
});

export abstract class AbstractStore {
	protected controller;
	public custom = {};
	public loading = false;
	public loaded = false;
	public config: any;

	constructor(config: any) {
		this.config = config;

		makeObservable(this, {
			custom: observable,
			loading: observable,
			loaded: observable,
		});
	}

	setConfig(newConfig: any): void {
		this.config = newConfig;
	}

	abstract update(data): void;

	toJSON(thing = this) {
		// TODO: make this work better
		return toJS(thing);
	}
}
