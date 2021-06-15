import deepmerge from 'deepmerge';

import { AbstractController } from '../Abstract/AbstractController';
import type { SearchControllerConfig, BeforeSearchObj, AfterSearchObj, ControllerServices, NextEvent } from '../types';
import { getSearchParams } from '../utils/getParams';

const defaultConfig: SearchControllerConfig = {
	id: 'search',
	globals: {},
	settings: {
		redirects: {
			merchandising: true,
			singleResult: true,
		},
		facets: {
			trim: true,
		},
	},
};

export class SearchController extends AbstractController {
	config: SearchControllerConfig;

	constructor(config: SearchControllerConfig, { client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker });

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (search: BeforeSearchObj, next: NextEvent): Promise<void | boolean> => {
			search.controller.store.loading = true;

			await next();
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (search: AfterSearchObj, next: NextEvent): Promise<void | boolean> => {
			await next();

			const config = search.controller.config;
			const redirectURL = search?.response?.merchandising?.redirect;

			if (redirectURL && config?.settings?.redirects?.merchandising) {
				window.location.replace(redirectURL);
				return false;
			}

			if (
				config?.settings?.redirects?.singleResult &&
				search?.response.search.query &&
				search?.response?.pagination?.totalResults === 1 &&
				!search?.response?.filters?.length
			) {
				window.location.replace(search?.response.results[0].mappings.core.url);
				return false;
			}
			search.controller.store.loading = false;
		});
	}

	get params(): Record<string, any> {
		const params: Record<string, any> = deepmerge({ ...getSearchParams(this.urlManager.state) }, this.config.globals);

		// redirect setting
		if (!this.config.settings?.redirects?.merchandising) {
			params.search = params.search || {};
			params.search.redirectResponse = 'full';
		}

		return params;
	}

	search = async (): Promise<SearchController> => {
		// TODO: call this.init() if it has never been called

		const params = this.params;

		try {
			try {
				await this.eventManager.fire('beforeSearch', {
					controller: this,
					request: params,
				});
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'beforeSearch' middleware cancelled`);
					return this;
				} else {
					this.log.error(`error in 'beforeSearch' middleware`);
					throw err;
				}
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			// TODO (notsureif)
			// provide a means to access the actual request parameters (params + globals)
			// 				* add params(params) function to client that spits back the JSON request (takes params param) - incorporates globals + params param

			const response = await this.client.search(params);
			if (!response.meta) {
				/**
				 * MockSnapClient will overwrite the client search() method and use
				 * SearchData to return mock data which already contains meta data
				 */
				response.meta = this.client.meta;
			}

			// modify response
			// TODO: move to store
			if (this.config.settings.facets.trim) {
				response.facets = response.facets.filter((facet) => {
					if (!facet.filtered && facet.values?.length == 1) {
						return facet.values[0].count != response.pagination.totalResults;
					} else if (facet.values?.length == 0) {
						return false;
					} else if (facet.type == 'range' && facet.range.low == facet.range.high) {
						return false;
					}

					return true;
				});
			}

			searchProfile.stop();
			this.log.profile(searchProfile);

			const afterSearchProfile = this.profiler.create({ type: 'event', name: 'afterSearch', context: params }).start();

			try {
				await this.eventManager.fire('afterSearch', {
					controller: this,
					request: params,
					response,
				});
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterSearch' middleware cancelled`);
					afterSearchProfile.stop();
					return this;
				} else {
					this.log.error(`error in 'afterSearch' middleware`);
					throw err;
				}
			}

			afterSearchProfile.stop();
			this.log.profile(afterSearchProfile);

			// update the store
			// console.log("this.store:", this.store)
			this.store.update(response);

			const afterStoreProfile = this.profiler.create({ type: 'event', name: 'afterStore', context: params }).start();

			try {
				await this.eventManager.fire('afterStore', {
					controller: this,
					request: params,
					response,
				});
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterStore' middleware cancelled`);
					afterStoreProfile.stop();
					return this;
				} else {
					this.log.error(`error in 'afterStore' middleware`);
					throw err;
				}
			}

			afterStoreProfile.stop();
			this.log.profile(afterStoreProfile);
		} catch (err) {
			if (err) {
				console.error(err);
			}
		}

		return this;
	};
}
