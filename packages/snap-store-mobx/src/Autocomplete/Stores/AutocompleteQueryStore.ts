import { observable, makeObservable } from 'mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { SearchResponseModelSearch, AutocompleteResponseModelAllOfAutocomplete } from '@searchspring/snapi-types';
import type { StoreServices } from '../../types';

export class AutocompleteQueryStore {
	public query?: Query;
	public originalQuery?: Query;

	constructor(services: StoreServices, autocomplete: AutocompleteResponseModelAllOfAutocomplete, search: SearchResponseModelSearch) {
		const observables: Observables = {};

		if (search?.query) {
			this.query = new Query(services.urlManager, search.query);
			observables.query = observable;
		}

		if (autocomplete?.correctedQuery && autocomplete.query) {
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
	public string: string;
	public url: UrlManager;

	constructor(urlManager: UrlManager, query: string) {
		this.string = query;

		this.url = urlManager.set({ query: this.string });

		makeObservable(this, {
			string: observable,
		});
	}
}
