import { StorageStore, StorageType } from '../../Storage/StorageStore';
import type { StoreServices } from '../../types';
import { Query } from './SearchQueryStore';

export type HistoryStoreConfig = {
	siteId?: string;
	max?: number;
	url?: string;
};
export class SearchHistoryStore {
	private config: HistoryStoreConfig;
	private storage: StorageStore;
	private services: StoreServices;

	constructor(config: HistoryStoreConfig, services: StoreServices) {
		this.config = config;
		this.services = services;

		if (this.config.url) {
			this.services.urlManager = this.services.urlManager.withConfig((translatorConfig: any) => {
				return {
					...translatorConfig,
					urlRoot: this.config.url,
				};
			});
		}

		if (!Number.isInteger(this.config.max)) {
			this.config.max = 25;
		}

		this.storage = new StorageStore({
			type: StorageType.LOCAL,
			key: `ss-history${this.config.siteId ? `-${this.config.siteId}` : ``}`,
		});

		// reset to zero to clear any potentially existing terms
		if (this.config.max === 0) {
			this.reset();
		}

		// trim history if the current queries are more than config max
		if (this.queries.length > this.config.max!) {
			this.getStoredData().forEach((term, index) => {
				if (index > this.config.max! - 1) {
					this.remove(term);
				}
			});
		}
	}

	get queries(): Query[] {
		const queries = this.getStoredData();
		return queries.map((query) => new Query(this.services, query));
	}

	public save(term: string) {
		// adding term to array if max is not zero
		if (this.config.max) {
			const history = this.getStoredData();

			// removing term if already present
			const index = history.indexOf(term);
			if (index != -1) {
				history.splice(index, 1);
			}

			history.unshift(term);
			if (history.length > this.config.max!) {
				history.pop();
			}

			this.storage.set('history', JSON.stringify(history));
		}
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
