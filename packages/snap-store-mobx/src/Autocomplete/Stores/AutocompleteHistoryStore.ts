import type { StoreServices } from '../../types';
import type { AutocompleteStateStore } from './AutocompleteStateStore';
import { Term } from './AutocompleteTermStore';

export class AutocompleteHistoryStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services: StoreServices, queries: string[], resetTerms: () => void, rootState: AutocompleteStateStore) {
		const terms: Array<Term> = [];

		queries?.map((query) => {
			terms.push(
				new Term(
					services,
					{
						active: false,
						value: query,
					},
					terms,
					resetTerms,
					rootState
				)
			);
		});

		super(...terms);
	}
}
