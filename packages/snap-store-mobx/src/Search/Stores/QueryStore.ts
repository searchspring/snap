import { observable, makeObservable } from 'mobx';

import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StoreServices } from '../../types';
import type { SearchResponseModelSearch, SearchResponseModelSearchMatchTypeEnum } from '@searchspring/snapi-types';
export class QueryStore {
	query: Query;
	didYouMean: Query;
	originalQuery: Query;
	matchType: SearchResponseModelSearchMatchTypeEnum;

	constructor(services: StoreServices, search: SearchResponseModelSearch) {
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

		if (search?.matchType) {
			this.matchType = search.matchType;
			observables.matchType = observable;
		}

		makeObservable(this, observables);
	}
}

type Observables = {
	query?: typeof observable;
	didYouMean?: typeof observable;
	originalQuery?: typeof observable;
	matchType?: typeof observable;
};

class Query {
	string: string;
	url: UrlManager;

	constructor(services: StoreServices, query: string) {
		this.string = query;

		this.url = services.urlManager.remove('page').remove('filter').set('query', this.string);

		makeObservable(this, {
			string: observable,
		});
	}
}
