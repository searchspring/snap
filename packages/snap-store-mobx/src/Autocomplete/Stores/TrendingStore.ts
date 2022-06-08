import { observable, makeObservable } from 'mobx';

import type { TrendingResponseModel } from '@searchspring/snap-client';
import type { StoreServices } from '../../types';
import type { StateStore } from './StateStore';
import { Term } from './TermStore';

export class TrendingStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services: StoreServices, trendingData: TrendingResponseModel, resetTerms: () => void, rootState: StateStore) {
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
					rootState
				)
			);
		});

		super(...terms);
	}
}
