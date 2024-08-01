import { observable, makeObservable } from 'mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { AutocompleteStoreConfig, StoreServices } from '../../types';
import { AutocompleteStateStore } from './AutocompleteStateStore';
import { AutocompleteResponseModel } from '@searchspring/snapi-types';

type AutocompleteTermStoreConfig = TermConfig & {
	config: AutocompleteStoreConfig;
	data: {
		autocomplete: AutocompleteResponseModel;
	};
};
export class AutocompleteTermStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(params: AutocompleteTermStoreConfig) {
		const { config, data } = params;
		const { autocomplete, search, pagination } = data.autocomplete;
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
			} else if (autocomplete?.correctedQuery && pagination?.totalResults) {
				// the query was corrected
				suggestions.unshift(autocomplete.correctedQuery);
			} else if (autocomplete?.query && pagination?.totalResults) {
				// there were no suggestions or corrections,
				suggestions.unshift(autocomplete?.query);
			}
		}

		const terms: Array<Term> = [];

		suggestions.map((term, index) =>
			terms.push(
				new Term(
					params,
					{
						active: index === 0,
						value: term,
					},
					terms
				)
			)
		);

		super(...terms);
	}
}

export type TermConfig = {
	services: StoreServices;
	functions: {
		resetTerms: () => void;
	};
	state: {
		autocomplete: AutocompleteStateStore;
	};
};

export class Term {
	public active: boolean;
	public value: string;
	public preview: () => void;
	public url: UrlManager;

	constructor(params: TermConfig, term: { active: boolean; value: string }, terms: Term[]) {
		const { services, functions, state } = params;

		this.active = term.active;
		this.value = term.value;

		this.url = services?.urlManager?.set({ query: this.value });

		this.preview = () => {
			functions?.resetTerms();
			terms.map((term) => {
				term.active = false;
			});

			this.active = true;
			state?.autocomplete.locks.terms.lock();
			state?.autocomplete.locks.facets.unlock();

			this.url?.set({ query: this.value }).go();
		};

		makeObservable(this, {
			active: observable,
			value: observable,
		});
	}
}
