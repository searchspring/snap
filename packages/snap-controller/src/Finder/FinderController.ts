import deepmerge from 'deepmerge';

import { ErrorType } from '@searchspring/snap-store-mobx';

import { AbstractController } from '../Abstract/AbstractController';
import { getSearchParams } from '../utils/getParams';
import type { FinderStore } from '@searchspring/snap-store-mobx';
import type { FinderControllerConfig, BeforeSearchObj, AfterSearchObj, ControllerServices, NextEvent } from '../types';

const defaultConfig: FinderControllerConfig = {
	id: 'finder',
	globals: {},
	fields: [],
};

export class FinderController extends AbstractController {
	public type = 'finder';
	public store: FinderStore;
	config: FinderControllerConfig;

	constructor(config: FinderControllerConfig, { client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker });

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);
		this.store.setConfig(this.config);

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
		this.eventManager.on('beforeSearch', async (finder: BeforeSearchObj, next: NextEvent): Promise<void | boolean> => {
			finder.controller.store.loading = true;

			await next();
		});

		// TODO: move this to afterStore
		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (finder: AfterSearchObj, next: NextEvent): Promise<void | boolean> => {
			await next();

			finder.controller.store.loading = false;
		});

		// attach config plugins and event middleware
		this.use(this.config);
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
		// only need to reset when selections have been made
		if (this.urlManager.state.filter) {
			this.store.storage.clear();
			this.urlManager.remove('filter').go();
		}
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

			const [response, meta] = await this.client.search(params);
			if (!response.meta) {
				/**
				 * MockClient will overwrite the client search() method and use
				 * SearchData to return mock data which already contains meta data
				 */
				response.meta = meta;
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
				switch (err) {
					case 429:
						this.store.error = {
							code: 429,
							type: ErrorType.WARNING,
							message: 'Too many requests try again later',
						};
						this.log.warn(this.store.error);
						break;
					case 500:
						this.store.error = {
							code: 500,
							type: ErrorType.ERROR,
							message: 'Invalid Search Request or Service Unavailable',
						};
						this.log.error(this.store.error);
						break;
					default:
						this.log.error(err);
						break;
				}
				this.store.loading = false;
			}
		}
	};
}
