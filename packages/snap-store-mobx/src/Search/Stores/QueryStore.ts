import { observable, makeObservable } from 'mobx';

export class QueryStore {
	query: Query;
	didYouMean: Query;
	originalQuery: Query;

	constructor(services, search) {
		const observables: Observables = {};

		if (search?.query) {
			this.query = new Query(services, search.query);
			observables.query = observable;
		}

		if (search?.didYouMean) {
			this.didYouMean = new Query(services, search.didYouMean);
			observables.didYouMean = observable;
		}

		if (search?.originalQuery) {
			this.originalQuery = new Query(services, search.originalQuery);
			observables.originalQuery = observable;
		}

		makeObservable(this, observables);
	}
}

type Observables = {
	query?: typeof observable;
	didYouMean?: typeof observable;
	originalQuery?: typeof observable;
};

class Query {
	string: string;
	url;

	constructor(services, query) {
		this.string = query;

		this.url = services.urlManager.remove('page').remove('filter').set('query', this.string);

		makeObservable(this, {
			string: observable,
		});
	}
}
