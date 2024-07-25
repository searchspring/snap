import type { AutocompleteTrendingData, StoreParameters } from '../../types';
import { Term } from './AutocompleteTermStore';

export class AutocompleteTrendingStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(params: StoreParameters<AutocompleteTrendingData>) {
		const terms: Array<Term> = [];
		const { data } = params;
		data.trending?.queries?.map((term) => {
			terms.push(
				new Term(
					params,
					{
						active: false,
						value: term.searchQuery,
					},
					terms
				)
			);
		});

		super(...terms);
	}
}
