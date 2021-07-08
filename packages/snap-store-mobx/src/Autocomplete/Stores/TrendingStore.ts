import { observable, makeObservable } from 'mobx';

export class TrendingStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services, trendingData, rootState) {
		const terms = [];

		trendingData?.queries?.map((term) => {
			terms.push(
				new Term(
					services,
					{
						active: false,
						value: term.searchQuery,
					},
					terms,
					rootState
				)
			);
		});

		super(...terms);
	}
}

class Term {
	active: boolean;
	value: string;
	preview: () => void;
	url;

	constructor(services, term, terms, rootState) {
		this.active = term.active;
		this.value = term.value;

		this.url = services?.urlManager?.detach().set({ query: this.value });

		this.preview = () => {
			terms.map((term) => {
				term.active = false;
			});

			this.active = true;
			rootState.locks.terms.lock();
			rootState.locks.facets.unlock();

			services?.urlManager.set({ query: this.value }).go();
		};

		makeObservable(this, {
			active: observable,
			value: observable,
		});
	}
}
