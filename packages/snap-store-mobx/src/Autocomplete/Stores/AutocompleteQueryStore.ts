import { observable, makeObservable } from 'mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { AutocompleteData, AutocompleteStoreConfig, StoreParameters } from '../../types';

export class AutocompleteQueryStore {
	public query?: Query;
	public originalQuery?: Query;
	public correctedQuery?: Query;

	constructor(params: StoreParameters<AutocompleteData>) {
		const { services, data, config } = params;
		const observables: Observables = {};

		if (data.search?.query) {
			this.query = new Query(services.urlManager, data.search.query);
			observables.query = observable;
		}

		if (data.autocomplete?.correctedQuery) {
			if ((config as AutocompleteStoreConfig).settings?.integratedSpellCorrection) {
				this.correctedQuery = new Query(services.urlManager, data?.autocomplete.correctedQuery);
				observables.correctedQuery = observable;
			} else if (data?.autocomplete.query) {
				this.originalQuery = new Query(services.urlManager, data?.autocomplete.query);
				observables.originalQuery = observable;
			}
		}

		makeObservable(this, observables);
	}
}

type Observables = {
	originalQuery?: typeof observable;
	query?: typeof observable;
	correctedQuery?: typeof observable;
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
