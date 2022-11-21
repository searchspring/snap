import deepmerge from 'deepmerge';

import { ErrorType } from '@searchspring/snap-store-mobx';

import { AbstractController } from '../Abstract/AbstractController';
import { getSearchParams } from '../utils/getParams';
import { ControllerTypes } from '../types';
import type { FinderStore } from '@searchspring/snap-store-mobx';
import type { Next } from '@searchspring/snap-event-manager';
import type { FinderControllerConfig, BeforeSearchObj, AfterSearchObj, ControllerServices, ContextVariables } from '../types';

const defaultConfig: FinderControllerConfig = {
	id: 'finder',
	globals: {
		pagination: {
			pageSize: 0,
		},
	},
	fields: [],
	persist: {
		enabled: false,
		lockSelections: true,
		expiration: 0,
	},
};

export class FinderController extends AbstractController {
	public type = ControllerTypes.finder;
	declare store: FinderStore;
	declare config: FinderControllerConfig;

	constructor(
		config: FinderControllerConfig,
		{ client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices,
		context?: ContextVariables
	) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker }, context);

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

		this.eventManager.on('beforeSearch', async (finder: BeforeSearchObj, next: Next): Promise<void | boolean> => {
			finder.controller.store.loading = true;

			await next();
		});

		// TODO: move this to afterStore
		this.eventManager.on('afterSearch', async (finder: AfterSearchObj, next: Next): Promise<void | boolean> => {
			await next();

			finder.controller.store.loading = false;
		});

		this.eventManager.on('beforeFind', async (finder: { controller: FinderController }, next: Next): Promise<void | boolean> => {
			await next();

			window.location.href = this.urlManager.href;
		});

		// attach config plugins and event middleware
		this.use(this.config);

		this.store.loadPersisted();
	}

	get params(): Record<string, any> {
		const urlState = this.urlManager.state;
		const userId = this.tracker.getUserId();
		const sessionId = this.tracker.getContext().sessionId;
		const pageLoadId = this.tracker.getContext().pageLoadId;

		let tracking: any = {};

		if (userId) {
			tracking.userId = userId;
		}
		if (sessionId) {
			tracking.sessionId = sessionId;
		}
		if (pageLoadId) {
			tracking!.pageLoadId = pageLoadId;
		}
		tracking.domain = window.location.href;

		// get only the finder fields and disable auto drill down
		const defaultParams = {
			facets: {
				include: this.config.fields.map((fieldConfig) => fieldConfig.field),
				autoDrillDown: false,
			},
			tracking: tracking,
		};

		const params: Record<string, any> = deepmerge({ ...getSearchParams(urlState) }, deepmerge(defaultParams, this.config.globals));

		return params;
	}

	find = async (): Promise<void> => {
		await this.store.save(); // save current selections to storage

		try {
			await this.eventManager.fire('beforeFind', {
				controller: this,
			});
		} catch (err: any) {
			if (err?.message == 'cancelled') {
				this.log.warn(`'beforeFind' middleware cancelled`);
			} else {
				this.log.error(`error in 'beforeFind' middleware`);
				this.log.error(err);
			}
		}
	};

	reset = (): void => {
		this.store.reset();
		this.urlManager.remove('filter').go();
		this.store.setService('urlManager', this.urlManager);
	};

	search = async (): Promise<void> => {
		if (!this.initialized) {
			await this.init();
		}

		if (this.store.state.persisted) {
			return;
		}

		const params = this.params;

		try {
			try {
				await this.eventManager.fire('beforeSearch', {
					controller: this,
					request: params,
				});
			} catch (err: any) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'beforeSearch' middleware cancelled`);
					return;
				} else {
					this.log.error(`error in 'beforeSearch' middleware`);
					throw err;
				}
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			const [meta, response] = await this.client.finder(params);
			// @ts-ignore
			if (!response.meta) {
				/**
				 * MockClient will overwrite the client search() method and use
				 * SearchData to return mock data which already contains meta data
				 */
				// @ts-ignore
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
			} catch (err: any) {
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
			// @ts-ignore
			this.store.update(response);

			const afterStoreProfile = this.profiler.create({ type: 'event', name: 'afterStore', context: params }).start();

			try {
				await this.eventManager.fire('afterStore', {
					controller: this,
					request: params,
					response,
				});
			} catch (err: any) {
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
				this.handleError(err);
			}
		}
	};
}
