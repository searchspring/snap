import { TrendingResponseModel } from '@searchspring/snap-client';
import { Term, TermConfig } from './AutocompleteTermStore';

type AutocompleteTrendingStoreConfig = TermConfig & {
	data: {
		trending: TrendingResponseModel;
	};
};

export class AutocompleteTrendingStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(params: AutocompleteTrendingStoreConfig) {
		const terms: Array<Term> = [];
		const { data } = params;
		const { trending } = data.trending;
		trending?.queries?.map((term) => {
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
