import { observable, makeObservable } from 'mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StateStore } from './StateStore';
import type { StoreServices } from '../../types';
import type { AutocompleteResponseModelAllOfAutocomplete, SearchResponseModelPagination } from '@searchspring/snapi-types';

export class TermStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(
		services: StoreServices,
		autocomplete: AutocompleteResponseModelAllOfAutocomplete,
		paginationData: SearchResponseModelPagination,
		resetTerms: () => void,
		rootState: StateStore
	) {
		const suggestions = [...(autocomplete?.alternatives ? autocomplete.alternatives : []).map((term) => term.text!)];

		if (autocomplete?.suggested?.text) {
			suggestions.unshift(autocomplete.suggested.text);
		} else if (autocomplete?.query && paginationData.totalResults) {
			suggestions.unshift(autocomplete?.query);
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
					rootState
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

	constructor(services: StoreServices, term: { active: boolean; value: string }, terms: Term[], resetTerms: () => void, rootState: StateStore) {
		this.active = term.active;
		this.value = term.value;

		this.url = services?.urlManager?.set({ query: this.value });

		this.preview = () => {
			resetTerms();
			terms.map((term) => {
				term.active = false;
			});

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
