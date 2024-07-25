import { observable, makeObservable } from 'mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { AutocompleteData, AutocompleteHistoryData, AutocompleteStoreConfig, AutocompleteTrendingData, StoreParameters } from '../../types';

export class AutocompleteTermStore extends Array<Term> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(params: StoreParameters<AutocompleteData>) {
		const { config, data } = params;
		const suggestions = [...(data.autocomplete?.alternatives ? data.autocomplete.alternatives : []).map((term) => term.text!)];

		if ((config as AutocompleteStoreConfig).settings?.integratedSpellCorrection) {
			if (
				data.autocomplete?.correctedQuery &&
				data.search?.query &&
				data.autocomplete.correctedQuery.toLowerCase() != data.search.query.toLowerCase()
			) {
				// the query was corrected
				suggestions.unshift(data.autocomplete.correctedQuery);
			}

			data.search?.query && suggestions.unshift(data.search.query);
		} else {
			if (data.autocomplete?.suggested?.text) {
				// a suggestion for query
				suggestions.unshift(data.autocomplete.suggested.text);
			} else if (data.autocomplete?.correctedQuery && data.pagination?.totalResults) {
				// the query was corrected
				suggestions.unshift(data.autocomplete.correctedQuery);
			} else if (data.autocomplete?.query && data.pagination?.totalResults) {
				// there were no suggestions or corrections,
				suggestions.unshift(data.autocomplete?.query);
			}
		}

		const terms: Array<Term> = [];

		suggestions.map((term, index) =>
			terms.push(
				new Term(
					params,
					{
						active: index === 0,
						value: term,
					},
					terms
				)
			)
		);

		super(...terms);
	}
}

export class Term {
	public active: boolean;
	public value: string;
	public preview: () => void;
	public url: UrlManager;

	constructor(
		params: StoreParameters<AutocompleteData | AutocompleteTrendingData | AutocompleteHistoryData>,
		term: { active: boolean; value: string },
		terms: Term[]
	) {
		const { services, functions, state } = params;

		this.active = term.active;
		this.value = term.value;

		this.url = services?.urlManager?.set({ query: this.value });

		this.preview = () => {
			functions?.resetTerms();
			terms.map((term) => {
				term.active = false;
			});

			this.active = true;
			state?.autocomplete.locks.terms.lock();
			state?.autocomplete.locks.facets.unlock();

			this.url?.set({ query: this.value }).go();
		};

		makeObservable(this, {
			active: observable,
			value: observable,
		});
	}
}
