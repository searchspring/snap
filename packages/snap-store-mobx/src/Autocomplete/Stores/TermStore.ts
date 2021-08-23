import { observable, makeObservable } from 'mobx';

export class TermStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services, autocomplete, paginationData, resetTerms, rootState) {
		const suggestions = [...(autocomplete?.alternatives ? autocomplete.alternatives : []).map((term) => term.text)];

		if (autocomplete?.suggested?.text) {
			suggestions.unshift(autocomplete.suggested.text);
		} else if (autocomplete?.query && paginationData.totalResults) {
			suggestions.unshift(autocomplete?.query);
		}

		const terms = [];

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
	active: boolean;
	value: string;
	preview: () => void;
	url;

	constructor(services, term, terms, resetTerms, rootState) {
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
			rootState.term = this.value;
			rootState.url = rootState.url.set('query', this.value);

			services?.urlManager.set({ query: this.value }).go();
		};

		makeObservable(this, {
			active: observable,
			value: observable,
		});
	}
}
