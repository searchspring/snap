import { observable, makeObservable } from 'mobx';

export class QueryStore {
	query: Query;
	didYouMean: Query;
	originalQuery: Query;

	constructor(controller, search) {
		const observables: Observables = {};

		if (search?.query) {
			this.query = new Query(controller, search.query);
			observables.query = observable;
		}

		if (search?.didYouMean) {
			this.didYouMean = new Query(controller, search.didYouMean);
			observables.didYouMean = observable;
		}

		if (search?.originalQuery) {
			this.originalQuery = new Query(controller, search.originalQuery);
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

	constructor(controller, query) {
		this.string = query;

		this.url = controller.urlManager.set({ query: this.string });

		makeObservable(this, {
			string: observable,
		});
	}
}
