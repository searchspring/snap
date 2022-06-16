import { render } from 'preact';
import deepmerge from 'deepmerge';

import { AppMode, DomTargeter, getContext } from '@searchspring/snap-toolbox';
import { Client } from '@searchspring/snap-client';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import type { ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { AbstractController, RecommendationController, Attachments, ContextVariables } from '@searchspring/snap-controller';
import type { Middleware } from '@searchspring/snap-event-manager';
import type { RootComponent } from '../types';
import type { Target } from '@searchspring/snap-toolbox';

export type RecommendationInstantiatorConfig = {
	mode?: keyof typeof AppMode | AppMode;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
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
	url?: UrlTranslatorConfig;
	context?: ContextVariables;
};

export type RecommendationInstantiatorServices = {
	client?: Client;
	logger?: Logger;
	tracker?: Tracker;
};

export class RecommendationInstantiator {
	private mode = AppMode.production;
	public client: Client;
	public tracker: Tracker;
	public logger: Logger;
	public controller: {
		[key: string]: RecommendationController;
	} = {};
	public config: RecommendationInstantiatorConfig;
	public context: ContextVariables;
	public targeter: DomTargeter;

	private uses: Attachments[] = [];
	private plugins: { func: (cntrlr: AbstractController, ...args: any) => Promise<void>; args: unknown[] }[] = [];
	private middleware: { event: string; func: Middleware<unknown>[] }[] = [];

	constructor(config: RecommendationInstantiatorConfig, services?: RecommendationInstantiatorServices, context?: ContextVariables) {
		this.config = config;

		if (!this.config) {
			throw new Error(`Recommendation Instantiator config is required`);
		}

		if (!this.config.config?.branch) {
			throw new Error(`Recommendation Instantiator config must contain 'branch' property`);
		}

		if (!this.config.components || typeof this.config.components != 'object' || !Object.keys(this.config.components).length) {
			throw new Error(`Recommendation Instantiator config must contain 'components' mapping property`);
		}

		if ((!services?.client || !services?.tracker) && !this.config?.client?.globals?.siteId) {
			throw new Error(`Recommendation Instantiator config must contain a valid config.client.globals.siteId value`);
		}

		if (this.config.mode && Object.values(AppMode).includes(this.config.mode as AppMode)) {
			this.mode = this.config.mode as AppMode;

			if (this.config?.client?.globals?.siteId) {
				this.config.client.config = this.config.client.config || {};
				this.config.client.config.mode = this.config.client.config.mode || this.mode;
			}
		}

		window.searchspring = window.searchspring || {};

		this.context = deepmerge(context || {}, config.context || {});
		this.client = services?.client || new Client(this.config.client!.globals, this.config.client!.config);
		this.tracker = services?.tracker || new Tracker(this.config.client!.globals);
		this.logger = services?.logger || new Logger({ prefix: 'RecommendationInstantiator ', mode: this.mode });

		const profileCount: {
			[key: string]: number;
		} = {};

		this.targeter = new DomTargeter(
			[
				{
					selector: `script[type="searchspring/recommend"], script[type="searchspring/personalized-recommendations"]${
						this.config.selector ? ` , ${this.config.selector}` : ''
					}`,
					inject: {
						action: 'before',
						element: (target: Target, origElement: Element) => {
							const profile = origElement.getAttribute('profile') || '';

							const recsContainer = document.createElement('div');
							recsContainer.setAttribute('searchspring-recommend', profile);
							return recsContainer;
						},
					},
				},
			],
			async (target: Target, injectedElem: Element | undefined, elem: Element | undefined) => {
				const tag = injectedElem?.getAttribute('searchspring-recommend');

				if (!tag) {
					this.logger.warn(`'profile' attribute is missing from <script> tag, skipping this profile`, elem);
					return;
				}

				const contextGlobals: any = {};

				const elemContext = getContext(
					['shopperId', 'shopper', 'product', 'seed', 'cart', 'options', 'profile', 'custom'],
					elem as HTMLScriptElement
				);
				const context: ContextVariables = deepmerge(this.context, elemContext);

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

				profileCount[tag] = profileCount[tag] + 1 || 1;

				const defaultGlobals = {
					limits: 20,
				};
				const globals = deepmerge(deepmerge(defaultGlobals, this.config.client?.globals || {}), contextGlobals);

				const controllerConfig = {
					id: `recommend_${tag}_${profileCount[tag] - 1}`,
					tag,
					batched: options?.batched ?? true,
					realtime: Boolean(options?.realtime),
					...this.config.config,
					globals,
				};

				const createRecommendationController = (await import('../create/createRecommendationController')).default;
				const controller = createRecommendationController(
					{
						url: this.config.url,
						controller: controllerConfig,
						context,
					},
					{ client: this.client, tracker: this.tracker }
				);

				this.uses.forEach((attachements) => controller.use(attachements));
				this.plugins.forEach((plugin) => controller.plugin(plugin.func, ...plugin.args));
				this.middleware.forEach((middleware) => controller.on(middleware.event, ...middleware.func));

				await controller.search();

				controller.addTargeter(this.targeter);

				this.controller[controller.config.id] = controller;
				window.searchspring.controller = window.searchspring.controller || {};
				window.searchspring.controller[controller.config.id] = controller;

				const profileVars = controller.store.profile.display.templateParameters;
				const component = controller.store.profile.display.template?.component;

				if (!profileVars) {
					this.logger.error(`profile '${tag}' found on ${elem} is missing templateParameters!`);
					return;
				}

				if (!component) {
					this.logger.error(`profile '${tag}' found on ${elem} is missing component!`);
					return;
				}

				const RecommendationsComponent = this.config.components[component] && (await this.config.components[component]());

				if (!RecommendationsComponent) {
					this.logger.error(`profile '${tag}' found on ${elem} is expecting component mapping for '${component}' - verify instantiator config.`);
					return;
				}

				setTimeout(() => {
					if (injectedElem) {
						render(<RecommendationsComponent controller={controller} />, injectedElem);
					}
				});
			}
		);
	}

	public plugin(func: (cntrlr: AbstractController, ...args: any) => Promise<void>, ...args: unknown[]): void {
		this.plugins.push({ func, args });
	}

	public on<T>(event: string, ...func: Middleware<unknown>[]): void {
		this.middleware.push({ event, func });
	}

	public use(attachments: Attachments): void {
		this.uses.push(attachments);
	}
}
