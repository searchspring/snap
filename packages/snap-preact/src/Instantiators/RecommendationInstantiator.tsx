import { render } from 'preact';

import { DomTargeter, getContext } from '@searchspring/snap-toolbox';

import type { Logger } from '@searchspring/snap-logger';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { Client } from '@searchspring/snap-client';
import type { Tracker } from '@searchspring/snap-tracker';
import type { AbstractController, RecommendationController, Attachments } from '@searchspring/snap-controller';
import type { Middleware } from '@searchspring/snap-event-manager';
import type { SnapControllerServices, RootComponent } from '../types';

export type RecommendationInstantiatorConfig = {
	components: {
		[name: string]: () => Promise<RootComponent> | RootComponent;
	};
	config: {
		branch: string;
		realtime?: boolean;
		batched?: boolean;
	} & Attachments;
	selector?: string;
	services?: SnapControllerServices;
	url?: UrlTranslatorConfig;
};

export type RecommendationInstantiatorServices = {
	client: Client;
	logger: Logger;
	tracker: Tracker;
};

export class RecommendationInstantiator {
	controllers: {
		[key: string]: RecommendationController;
	} = {};
	client: Client;
	tracker: Tracker;
	logger: Logger;
	config: RecommendationInstantiatorConfig;
	uses: Attachments[] = [];
	plugins: { (cntrlr: AbstractController): Promise<void> }[] = [];
	middleware: { event: string; func: Middleware<unknown>[] }[] = [];
	public targeter: DomTargeter;

	constructor(config: RecommendationInstantiatorConfig, { client, logger, tracker }: RecommendationInstantiatorServices) {
		this.config = config;

		if (!this.config) {
			throw new Error(`Recommendation Instantiator config is required`);
		}

		if (!this.config.config?.branch) {
			throw new Error(`Recommendation Instantiator config must contain 'branch' property`);
		}

		if (!this.config.components || typeof this.config.components != 'object') {
			throw new Error(`Recommendation Instantiator config must contain 'components' mapping property`);
		}

		this.client = client;
		this.tracker = tracker;
		this.logger = logger;

		const profileCount = {};
		this.targeter = new DomTargeter(
			[
				{
					selector: `script[type="searchspring/recommend"], script[type="searchspring/personalized-recommendations"]${
						this.config.selector ? ` , ${this.config.selector}` : ''
					}`,
					inject: {
						action: 'before',
						element: (target, origElement) => {
							const profile = origElement.getAttribute('profile');

							if (profile) {
								const recsContainer = document.createElement('div');
								recsContainer.setAttribute('searchspring-recommend', profile);
								return recsContainer;
							} else {
								this.logger.warn(`'profile' attribute is missing from <script> tag, skipping this profile`, origElement);
							}
						},
					},
				},
			],
			async (target, injectedElem, elem) => {
				const globals: any = {};

				const { shopper, shopperId, product, seed, options, realtime } = getContext(
					['shopperId', 'shopper', 'product', 'seed', 'options'],
					elem as HTMLScriptElement
				);

				/*
					type instantiatorContext = {
						shopper?: string;
						shopperId?: string;
						product?: string;
						seed?: string;
						options?: {
							siteId?: string;
							branch?: string;
							batched?: boolean;
							realtime?: boolean;
							categories?: any;
						}
					}
				*/

				if (shopper || shopperId) {
					globals.shopper = shopper || shopperId;
				}
				if (product || seed) {
					globals.product = product || seed;
				}
				if (options?.branch) {
					globals.branch = options.branch;
				}
				if (options?.siteId) {
					globals.siteId = options.siteId;
				}
				if (options?.categories) {
					globals.categories = options.categories;
				}

				const tag = injectedElem.getAttribute('searchspring-recommend');
				profileCount[tag] = profileCount[tag] + 1 || 1;

				const controllerConfig = {
					id: `recommend_${tag + (profileCount[tag] - 1)}`,
					tag,
					batched: options?.batched ?? true,
					realtime: Boolean(options?.realtime),
					globals,
					...this.config.config,
				};

				const createRecommendationController = (await import('../create/createRecommendationController')).default;
				const client = this.config.services?.client || this.client;
				const tracker = this.config.services?.tracker || this.tracker;
				const recs = createRecommendationController(
					{
						url: this.config.url || {},
						controller: controllerConfig,
					},
					{ client, tracker }
				);

				this.uses.forEach((attachements) => recs.use(attachements));
				this.plugins.forEach((plugin) => recs.plugin(plugin));
				this.middleware.forEach((middleware) => recs.on(middleware.event, ...middleware.func));

				await recs.search();

				recs.addTargeter(this.targeter);

				this.controllers[recs.config.id] = recs;

				const profileVars = recs.store.profile.display.templateParameters;
				const component = recs.store.profile.display.template?.component;

				if (!profileVars) {
					recs.log.error(`profile failed to load!`);
					return;
				}

				if (!component) {
					recs.log.error(`template does not support components!`);
					return;
				}

				const RecommendationsComponent = this.config.components && (await this.config.components[component]());

				if (!RecommendationsComponent) {
					recs.log.error(`component '${profileVars.component}' not found!`);
					return;
				}

				setTimeout(() => {
					render(<RecommendationsComponent controller={recs} />, injectedElem);
				});
			}
		);
	}

	public plugin(func: (cntrlr: AbstractController) => Promise<void>): void {
		this.plugins.push(func);
	}

	public on<T>(event: string, ...func: Middleware<T>[]): void {
		this.middleware.push({ event, func });
	}

	public use(attachments: Attachments): void {
		this.uses.push(attachments);
	}
}
