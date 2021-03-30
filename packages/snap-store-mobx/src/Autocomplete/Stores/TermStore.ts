import { observable, makeObservable } from 'mobx';

export class TermStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	private controller;

	constructor(controller, autocomplete, paginationData, rootState) {
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
					controller,
					{
						active: index === 0,
						value: term,
					},
					terms,
					rootState
				)
			)
		);

		super(...terms);
	}
}

class Term {
	active: boolean;
	value: string;
	preview: () => void;
	url;

	constructor(controller, term, terms, rootState) {
		this.active = term.active;
		this.value = term.value;

		this.url = controller?.urlManager?.detach().set({ query: this.value });

		this.preview = () => {
			terms.map((term) => {
				term.active = false;
			});

			this.active = true;
			rootState.locks.terms.lock();
			rootState.locks.facets.unlock();

			controller?.urlManager.set({ query: this.value }).go();
		};

		makeObservable(this, {
			active: observable,
			value: observable,
		});
	}
}
