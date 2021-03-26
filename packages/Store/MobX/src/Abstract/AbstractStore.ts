import { makeObservable, observable, toJS, configure } from 'mobx';

configure({
	// useProxies: "never",  // for IE 11 (es5) support
	enforceActions: 'never',
});

export abstract class AbstractStore {
	protected controller;
	public custom = {};
	public loading = true;
	public loaded = false;
	
	constructor() {
		makeObservable(this, {
			custom: observable,
			loading: observable,
			loaded: observable,
		});
	}

	abstract update(data): void;

	link(controller): void {
		this.controller = controller;
	}

	toJSON(thing = this) {
		// TODO: make this work better
		return toJS(thing);
	}
}
