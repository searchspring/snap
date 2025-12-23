import { observable, makeObservable } from 'mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { AutocompleteStateStore } from './AutocompleteStateStore';
import type { AutocompleteStoreConfig, StoreServices } from '../../types';
import type { AutocompleteResponseModelAllOfAutocomplete, SearchResponseModelPagination, SearchResponseModelSearch } from '@searchspring/snapi-types';

export class AutocompleteTermStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(
		services: StoreServices,
		autocomplete: AutocompleteResponseModelAllOfAutocomplete,
		paginationData: SearchResponseModelPagination,
		search: SearchResponseModelSearch,
		resetTerms: () => void,
		rootState: AutocompleteStateStore,
		config: AutocompleteStoreConfig
	) {
		const suggestions = [...(autocomplete?.alternatives ? autocomplete.alternatives : []).map((term) => term.text!)];

		if (config.settings?.integratedSpellCorrection) {
			if (autocomplete?.correctedQuery && search?.query && autocomplete.correctedQuery.toLowerCase() != search.query.toLowerCase()) {
				// the query was corrected
				suggestions.unshift(autocomplete.correctedQuery);
			}

			search?.query && suggestions.unshift(search.query);
		} else {
			if (autocomplete?.suggested?.text) {
				// a suggestion for query
				suggestions.unshift(autocomplete.suggested.text);
			} else if (autocomplete?.correctedQuery && paginationData.totalResults) {
				// the query was corrected
				suggestions.unshift(autocomplete.correctedQuery);
			} else if (autocomplete?.query && paginationData.totalResults) {
				// there were no suggestions or corrections,
				suggestions.unshift(autocomplete?.query);
			}
		}

		const terms: Array<Term> = [];

		suggestions.map((term, index) =>
			terms.push(
				new Term(
					services,
					{
						active: index === 0,
						value: term,
					},
					terms,
					resetTerms,
					rootState,
					'suggestion'
				)
			)
		);

		super(...terms);
	}
}

export class Term {
	public active: boolean;
	public value: string;
	public preview: () => void;
	public url: UrlManager;
	public type: 'popular' | 'historical' | 'suggestion' | 'typed';

	constructor(
		services: StoreServices,
		term: { active: boolean; value: string },
		terms: Term[],
		resetTerms: () => void,
		rootState: AutocompleteStateStore,
		type: 'popular' | 'historical' | 'suggestion' | 'typed'
	) {
		this.active = term.active;
		this.value = term.value;
		this.type = type;

		this.url = services?.urlManager?.set({ query: this.value });

		this.preview = () => {
			resetTerms();
			terms.map((term) => {
				term.active = false;
			});
			rootState.source = type;
			this.active = true;
			rootState.locks.terms.lock();
			rootState.locks.facets.unlock();

			this.url?.set({ query: this.value }).go();
		};

		makeObservable(this, {
			active: observable,
			value: observable,
		});
	}
}
