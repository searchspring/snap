import type { StoreServices } from '../../types';
import type { AutocompleteStateStore } from '../../Autocomplete/Stores/AutocompleteStateStore';
import { Term } from '../../Autocomplete/Stores/AutocompleteTermStore';
import { StorageStore, StorageType } from '../../Storage/StorageStore';

interface IHistoryStoreConfig {
	siteId?: string;
	limit?: number;
}

export class SearchHistoryStore {
	public terms: Array<Term> = [];
	private storage: StorageStore;
	private config: IHistoryStoreConfig;
	private services: StoreServices;
	private rootState?: AutocompleteStateStore;

	constructor(services: StoreServices, config?: IHistoryStoreConfig, rootState?: AutocompleteStateStore) {
		this.storage = new StorageStore({
			type: StorageType.LOCAL,
			key: `ss-history`,
		});

		this.services = services;
		this.rootState = rootState;
		this.config = config || {};

		const historyData = this.storedHistory;
		historyData?.map((term: string) => {
			this.terms.push(
				new Term(
					services,
					{
						active: false,
						value: term,
					},
					this.terms,
					() => this.resetHistory,
					rootState
				)
			);
		});
	}

	public saveToHistory(term: string) {
		let history = this.storedHistory;
		const index = history.indexOf(term);
		if (index != -1) {
			history.splice(index, 1);
		}
		history = ([] as string[]).concat(term, history);
		const limit = this.config.limit || 25;
		if (history.length > limit) {
			history.pop();
		}
		this.storage.set('history', JSON.stringify(history));

		this.terms = [];
		history?.map((term: string) => {
			this.terms.push(
				new Term(
					this.services,
					{
						active: false,
						value: term,
					},
					this.terms,
					() => this.resetHistory,
					this.rootState
				)
			);
		});
	}

	public resetHistory(): void {
		if (this.terms && this.terms?.length) {
			this.terms.forEach((term) => {
				term.active = false;
			});
		}
	}

	get storedHistory(): any {
		const storedHistory = this.storage.get('history');
		if (storedHistory) {
			return JSON.parse(storedHistory);
		} else {
			return [];
		}
	}
}
