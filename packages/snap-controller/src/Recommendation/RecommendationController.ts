import deepmerge from 'deepmerge';
import { AbstractController } from '../Abstract/AbstractController';
import type { RecommendationControllerConfig, BeforeSearchObj, AfterSearchObj, ControllerServices, NextEvent } from '../types';
import { ControllerEnvironment } from '../types';

const defaultConfig: RecommendationControllerConfig = {
	id: 'recommend',
	tag: '',
	globals: {},
};

export class RecommendationController extends AbstractController {
	config: RecommendationControllerConfig;

	constructor(config: RecommendationControllerConfig, { client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker });

		if (!config.tag) {
			throw new Error(`Invalid config passed to RecommendationController. The "tag" attribute is required.`);
		}

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (recommend: BeforeSearchObj, next: NextEvent): Promise<void | boolean> => {
			recommend.controller.store.loading = true;

			await next();
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (recommend: AfterSearchObj, next: NextEvent): Promise<void | boolean> => {
			await next();

			recommend.controller.store.loading = false;
		});
	}

	get params(): Record<string, any> {
		// TODO: add cart, shopper, lastViewed
		const params = {
			tag: this.config.tag,
			...this.config.globals,
		};

		// TODO: use env branch variable (from webpack?)
		params.branch = this.config.branch || 'production';

		if (this.environment == ControllerEnvironment.DEVELOPMENT) {
			params.test = true;
		}

		return params;
	}

	search = async (): Promise<RecommendationController> => {
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

			const response = await this.client.recommend(params);
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
