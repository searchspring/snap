import { observable, makeObservable } from 'mobx';

import type { TrendingResponseModel } from '@searchspring/snap-client';
import type { StoreServices } from '../../types';
import type { AutocompleteStateStore } from './AutocompleteStateStore';
import { Term } from './AutocompleteTermStore';

export class AutocompleteHistoryStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services: StoreServices, historyData: string[] = [], resetTerms: () => void, rootState: AutocompleteStateStore) {
		const terms: Array<Term> = [];

		historyData?.map((term) => {
			terms.push(
				new Term(
					services,
					{
						active: false,
						value: term,
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
