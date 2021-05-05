import { observable, action, computed, makeObservable } from 'mobx';

export class QueryStore {
	query: Query;
	originalQuery: Query;

	constructor(controller, autocomplete, search) {
		const observables: Observables = {};

		if (search?.query) {
			this.query = new Query(controller, search.query);
			observables.query = observable;
		}

		if (autocomplete?.correctedQuery) {
			this.originalQuery = new Query(controller, autocomplete.query);
			observables.originalQuery = observable;
		}

		makeObservable(this, observables);
	}
}

type Observables = {
	originalQuery?: typeof observable;
	query?: typeof observable;
};
class Query {
	string: string;
	url;

	constructor(controller, query) {
		this.string = query;

		this.url = controller.urlManager.set({ query: this.string });

		makeObservable(this, {
			string: observable,
		});
	}
}
