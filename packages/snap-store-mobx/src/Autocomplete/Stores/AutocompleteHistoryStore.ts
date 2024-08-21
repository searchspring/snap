import { Term, TermData } from './AutocompleteTermStore';

type AutocompleteHistoryStoreConfig = Omit<TermData, 'data'> & {
	data: {
		queries: string[];
	};
};

export class AutocompleteHistoryStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(params: AutocompleteHistoryStoreConfig) {
		const { data } = params || {};
		const { queries } = data || {};
		const terms: Array<Term> = [];

		queries?.map((query) => {
			terms.push(
				new Term({
					...params,
					data: {
						term: {
							active: false,
							value: query,
						},
						terms,
					},
				})
			);
		});

		super(...terms);
	}
}
