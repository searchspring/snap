import { StorageStore, StorageType } from '../../Storage/StorageStore';
import type { StoreServices } from '../../types';
import { Query } from './SearchQueryStore';

export type HistoryStoreConfig = {
	siteId?: string;
	limit?: number;
};
export class SearchHistoryStore {
	private config: HistoryStoreConfig;
	private storage: StorageStore;
	private services: StoreServices;

	constructor(config: HistoryStoreConfig, services: StoreServices) {
		this.config = config;
		this.services = services;

		if (!Number.isInteger(this.config.limit)) {
			this.config.limit = 25;
		}

		this.storage = new StorageStore({
			type: StorageType.LOCAL,
			key: `ss-history${this.config.siteId ? `-${this.config.siteId}` : ``}`,
		});
	}

	get queries(): Query[] {
		const queries = this.getStoredData();
		return queries.map((query) => new Query(this.services, query));
	}

	public save(term: string) {
		const history = this.getStoredData();

		// removing term if already present
		const index = history.indexOf(term);
		if (index != -1) {
			history.splice(index, 1);
		}

		// adding term to array
		history.unshift(term);
		if (history.length > this.config.limit!) {
			history.pop();
		}

		this.storage.set('history', JSON.stringify(history));
	}

	public remove(term: string) {
		const history = this.getStoredData();

		// removing term if already present
		const index = history.indexOf(term);
		if (index != -1) {
			history.splice(index, 1);
			this.storage.set('history', JSON.stringify(history));
		}
	}

	public reset(): void {
		this.storage.clear();
	}

	public getStoredData(limit?: number): string[] {
		const storedHistory = this.storage.get('history');
		if (storedHistory) {
			try {
				const history = JSON.parse(storedHistory);
				if (Array.isArray(history)) {
					if (limit && Number.isInteger(limit)) {
						return history.slice(0, limit);
					}
					return history;
				}
			} catch (err) {
				// storage corrupted - resetting it
				this.reset();
			}
		}

		return [];
	}
}
