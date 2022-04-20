import { render } from 'preact';
import deepmerge from 'deepmerge';

import { DomTargeter, getContext } from '@searchspring/snap-toolbox';

import type { Logger } from '@searchspring/snap-logger';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { Client } from '@searchspring/snap-client';
import type { Tracker } from '@searchspring/snap-tracker';
import type { AbstractController, RecommendationController, Attachments, ContextVariables } from '@searchspring/snap-controller';
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
		limit?: number;
	} & Attachments;
	selector?: string;
	services?: SnapControllerServices;
	url?: UrlTranslatorConfig;
	context?: ContextVariables;
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
	context: ContextVariables;
	uses: Attachments[] = [];
	plugins: { (cntrlr: AbstractController): Promise<void> }[] = [];
	middleware: { event: string; func: Middleware<unknown>[] }[] = [];
	public targeter: DomTargeter;

	constructor(config: RecommendationInstantiatorConfig, { client, logger, tracker }: RecommendationInstantiatorServices, context?: ContextVariables) {
		this.config = config;
		this.context = deepmerge(context || {}, config.context || {});

		if (!this.config) {
			throw new Error(`Recommendation Instantiator config is required`);
		}

		if (!this.config.config?.branch) {
			throw new Error(`Recommendation Instantiator config must contain 'branch' property`);
		}

		if (!this.config.components || typeof this.config.components != 'object') {
			throw new Error(`Recommendation Instantiator config must contain 'components' mapping property`);
		}

		this.client = this.config.services?.client || client;
		this.tracker = this.config.services?.tracker || tracker;
		this.logger = this.config.services?.logger || logger;

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
				const contextGlobals: any = {};

				const elemContext = getContext(
					['shopperId', 'shopper', 'product', 'seed', 'cart', 'options', 'profile', 'custom'],
					elem as HTMLScriptElement
				);
				const context = deepmerge(this.context, elemContext);

				const { shopper, shopperId, product, seed, cart, options } = context;

				/*
					type instantiatorContext = {
						shopper?: {
							id: string;
						};
						shopperId?: string;
						product?: string;
						seed?: string;
						cart?: string[] | () => string[];
						options?: {
							siteId?: string;
							branch?: string;
							batched?: boolean;
							realtime?: boolean;
							categories?: any;
							limit?: number;
						}
					}
				*/

				if (shopper || shopperId) {
					contextGlobals.shopper = shopper?.id || shopperId;
				}
				if (product || seed) {
					contextGlobals.product = product || seed;
				}
				if (options?.branch) {
					contextGlobals.branch = options.branch;
				}
				if (options?.siteId) {
					contextGlobals.siteId = options.siteId;
				}
				if (options?.categories) {
					contextGlobals.categories = options.categories;
				}
				if (options?.limit && Number.isInteger(Number(options?.limit))) {
					contextGlobals.limits = Number(options?.limit);
				}
				let cartContents;
				if (typeof cart === 'function') {
					try {
						const cartFuncContents = cart();
						if (Array.isArray(cartFuncContents)) {
							cartContents = cartFuncContents;
						}
					} catch (e) {
						this.logger.warn(`Error getting cart contents from function`, e);
					}
				} else if (Array.isArray(cart)) {
					cartContents = cart;
				}
				if (Array.isArray(cartContents)) {
					this.tracker.cookies.cart.set(cartContents);
					contextGlobals.cart = this.tracker.cookies.cart.get();
				}

				const tag = injectedElem.getAttribute('searchspring-recommend');
				profileCount[tag] = profileCount[tag] + 1 || 1;

				const defaultGlobals = {
					limits: 20,
				};
				const globals = deepmerge(deepmerge(defaultGlobals, this.config.config?.globals || {}), contextGlobals);

				const controllerConfig = {
					id: `recommend_${tag + (profileCount[tag] - 1)}`,
					tag,
					batched: options?.batched ?? true,
					realtime: Boolean(options?.realtime),
					...this.config.config,
					globals,
				};

				const createRecommendationController = (await import('../create/createRecommendationController')).default;
				const client = this.client;
				const tracker = this.tracker;
				const recs = createRecommendationController(
					{
						url: this.config.url,
						controller: controllerConfig,
						context,
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
