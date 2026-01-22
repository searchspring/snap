import type { TrendingResponseModel } from '@searchspring/snap-client';
import type { StoreServices } from '../../types';
import type { AutocompleteStateStore } from './AutocompleteStateStore';
import { Term } from './AutocompleteTermStore';
import { AutocompleteRequestModelSearchSourceEnum } from '@searchspring/snapi-types';

export class AutocompleteTrendingStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services: StoreServices, trendingData: TrendingResponseModel, resetTerms: () => void, rootState: AutocompleteStateStore) {
		const terms: Array<Term> = [];

		trendingData?.trending?.queries?.map((term) => {
			terms.push(
				new Term(
					services,
					{
						active: false,
						value: term.searchQuery,
					},
					terms,
					resetTerms,
					rootState,
					'popular' as AutocompleteRequestModelSearchSourceEnum
				)
			);
		});

		super(...terms);
	}
}
