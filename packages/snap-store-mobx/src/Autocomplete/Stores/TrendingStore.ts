import { observable, makeObservable } from 'mobx';

import type { StoreServices } from '../../types';
import type { StateStore } from './StateStore';
import { Term } from './TermStore';

export class TrendingStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services: StoreServices, trendingData, resetTerms: () => void, rootState: StateStore) {
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
					resetTerms,
					rootState
				)
			);
		});

		super(...terms);
	}
}
