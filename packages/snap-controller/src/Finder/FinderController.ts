import deepmerge from 'deepmerge';

import { AbstractController } from '../Abstract/AbstractController';

import type { FinderControllerConfig, BeforeSearchObj, AfterSearchObj, ControllerServices, NextEvent } from '../types';
import { getSearchParams } from '../utils/getParams';

const defaultConfig: FinderControllerConfig = {
	id: 'finder',
	globals: {},
	fields: [],
};

export class FinderController extends AbstractController {
	config: FinderControllerConfig;

	constructor(config: FinderControllerConfig, { client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker });

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);
		this.store.setConfig(this.config);

		this.urlManager = this.urlManager;

		// set the root URL on urlManager
		if (this.config.url) {
			this.urlManager = this.urlManager.withConfig((translatorConfig) => {
				return {
					...translatorConfig,
					urlRoot: this.config.url,
				};
			});
		}

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (search: BeforeSearchObj, next: NextEvent): Promise<void | boolean> => {
			search.controller.store.loading = true;

			await next();
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (search: AfterSearchObj, next: NextEvent): Promise<void | boolean> => {
			await next();

			search.controller.store.loading = false;
		});
	}

	get params(): Record<string, any> {
		const urlState = this.urlManager.state;
		const params: Record<string, any> = deepmerge({ ...getSearchParams(urlState) }, this.config.globals);

		// get only the finder fields
		params.facets = {
			include: this.config.fields.map((fieldConfig) => fieldConfig.field),
		};

		return params;
	}

	find = (): void => {
		window.location.href = this.urlManager.href;
	};

	reset = (): void => {
		this.urlManager = this.urlManager.remove('filter');
		this.store.storage.clear();
		this.search();
	};

	search = async (): Promise<void> => {
		if (!this.initialized) {
			await this.init();
		}

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
					return;
				} else {
					this.log.error(`error in 'beforeSearch' middleware`);
					throw err;
				}
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			const response = await this.client.search(params);
			if (!response.meta) {
				/**
				 * MockClient will overwrite the client search() method and use
				 * SearchData to return mock data which already contains meta data
				 */
				response.meta = this.client.meta;
			}

			searchProfile.stop();
			this.log.profile(searchProfile);

			// TODO: move to store
			// re-order facets to match our config
			response.facets.sort((a, b) => {
				const fields = this.config.fields.map((fieldConfig) => fieldConfig.field);
				return fields.indexOf(a.field) - fields.indexOf(b.field);
			});

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
					return;
				} else {
					this.log.error(`error in 'afterSearch' middleware`);
					throw err;
				}
			}

			afterSearchProfile.stop();
			this.log.profile(afterSearchProfile);

			// update the store
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
					return;
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
	};
}
