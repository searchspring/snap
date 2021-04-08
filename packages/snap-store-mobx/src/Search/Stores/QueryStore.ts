import { observable, makeObservable } from 'mobx';

export class QueryStore {
	query: string;
	didYouMean: AlternateQuery;
	originalQuery: AlternateQuery;

	constructor(controller, search) {
		const observables: Observables = {
			query: observable,
		};
		this.query = search?.query;

		if (search?.didYouMean) {
			this.didYouMean = new AlternateQuery(controller, search.didYouMean);
			observables.didYouMean = observable;
		}

		if (search?.originalQuery) {
			this.originalQuery = new AlternateQuery(controller, search.originalQuery);
			observables.originalQuery = observable;
		}

		makeObservable(this, observables);
	}
}

type Observables = {
	query: typeof observable;
	didYouMean?: typeof observable;
	originalQuery?: typeof observable;
};

class AlternateQuery {
	query: string;
	url;

	constructor(controller, query) {
		this.query = query;

		this.url = controller.urlManager.set({ query: this.query });

		makeObservable(this, {
			query: observable,
		});
	}
}
