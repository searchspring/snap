import { observable, makeObservable } from 'mobx';
import { Term } from './TermStore';
export class TrendingStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services, trendingData, resetTerms, rootState) {
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
