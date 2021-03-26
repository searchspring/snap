import { observable, action, computed, makeObservable } from 'mobx';

export class QueryStore {
	query: string;
	originalQuery: string;

	constructor(autocomplete, search) {
		const observables: Observables = {
			query: observable,
		};

		this.query = search?.query;

		if (autocomplete?.correctedQuery) {
			this.originalQuery = autocomplete.query;
			observables.originalQuery = observable;
		}

		makeObservable(this, observables);
	}
}

type Observables = {
	originalQuery?: typeof observable;
	query: typeof observable;
};
