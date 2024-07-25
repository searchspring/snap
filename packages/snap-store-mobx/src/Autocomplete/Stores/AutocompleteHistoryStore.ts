import type { AutocompleteHistoryData, StoreParameters } from '../../types';
import { Term } from './AutocompleteTermStore';

export class AutocompleteHistoryStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(params: StoreParameters<AutocompleteHistoryData>) {
		const { data } = params;
		const { queries } = data;
		const terms: Array<Term> = [];

		queries?.map((query) => {
			terms.push(
				new Term(
					params,
					{
						active: false,
						value: query,
					},
					terms
				)
			);
		});

		super(...terms);
	}
}
