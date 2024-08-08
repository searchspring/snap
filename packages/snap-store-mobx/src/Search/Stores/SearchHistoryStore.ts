import { StorageStore } from '../../Storage/StorageStore';
import type { SearchStoreConfig, StoreServices } from '../../types';
import { Query } from './SearchQueryStore';

type SearchHistoryStoreConfig = {
	services: StoreServices;
	config: SearchStoreConfig;
};

export class SearchHistoryStore {
	private config: SearchStoreConfig;
	private storage: StorageStore;
	private services: StoreServices;
	private max: number;

	constructor(params: SearchHistoryStoreConfig) {
		const { services, config } = params || {};
		this.config = config;
		this.services = services;

		this.max = this.config.settings?.history?.max ?? 25;

		if (this.config.settings?.history?.url) {
			this.services.urlManager = this.services.urlManager.withConfig((translatorConfig: any) => {
				return {
					...translatorConfig,
					urlRoot: this.config.settings?.history?.url,
				};
			});
		}

		this.storage = new StorageStore({
			type: 'local',
			key: `ss-history${this.config.globals?.siteId ? `-${this.config.globals?.siteId}` : ``}`,
		});

		// reset to zero to clear any potentially existing terms
		if (this.max === 0) {
			this.reset();
		}

		// trim history if the current queries are more than config max
		if (this.queries.length > this.max) {
			this.getStoredData().forEach((term, index) => {
				if (index > this.max - 1) {
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
		if (this.max) {
			const history = this.getStoredData();

			// removing term if already present
			const index = history.indexOf(term);
			if (index != -1) {
				history.splice(index, 1);
			}

			history.unshift(term);
			if (history.length > this.max) {
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
