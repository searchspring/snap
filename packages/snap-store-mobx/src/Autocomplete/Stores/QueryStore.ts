import { observable, makeObservable } from 'mobx';

export class QueryStore {
	query: Query;
	originalQuery: Query;

	constructor(services, autocomplete, search) {
		const observables: Observables = {};

		if (search?.query) {
			this.query = new Query(services.urlManager, search.query);
			observables.query = observable;
		}

		if (autocomplete?.correctedQuery) {
			this.originalQuery = new Query(services.urlManager, autocomplete.query);
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

	constructor(urlManager, query) {
		this.string = query;

		this.url = urlManager.set({ query: this.string });

		makeObservable(this, {
			string: observable,
		});
	}
}
