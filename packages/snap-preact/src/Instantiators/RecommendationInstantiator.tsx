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
import type { Target } from '@searchspring/snap-toolbox';

export type RecommendationInstantiatorConfig = {
	mode?: keyof typeof AppMode | AppMode;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	components: {
		[name: string]: () => Promise<any> | any;
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
					autoRetarget: true,
					clickRetarget: true,
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
					['shopperId', 'shopper', 'product', 'products', 'seed', 'cart', 'options', 'profile', 'custom'],
					elem as HTMLScriptElement
				);
				const context: ContextVariables = deepmerge(this.context, elemContext);

				const { shopper, shopperId, product, products, seed, cart, options } = context;

				/*
					type instantiatorContext = {
						shopper?: {
							id: string;
						};
						shopperId?: string;
						product?: string;
						products?: string[];
						seed?: string;
						cart?: string[] | () => string[];
						options?: {
							siteId?: string;
							branch?: string;
							batched?: boolean;
							realtime?: boolean;
							categories?: string[];
							blockedItems?: string[];
							brands?: string[];
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
				if (products) {
					contextGlobals.products = products;
				}

				// options
				if (options?.branch) {
					contextGlobals.branch = options.branch;
				}
				if (options?.siteId) {
					contextGlobals.siteId = options.siteId;
				}
				if (options?.categories) {
					contextGlobals.categories = options.categories;
				}
				if (options?.filters) {
					contextGlobals.filters = options.filters;
				}
				if (options?.brands) {
					contextGlobals.brands = options.brands;
				}
				if (options?.limit && Number.isInteger(Number(options?.limit))) {
					contextGlobals.limits = Number(options?.limit);
				}
				if (options?.blockedItems && Array.isArray(options.blockedItems)) {
					contextGlobals.blockedItems = options.blockedItems;
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
				const globals = deepmerge(
					deepmerge(deepmerge(defaultGlobals, this.config.client?.globals || {}), (this.config.config?.globals as any) || {}),
					contextGlobals
				);

				const controllerConfig = {
					id: `recommend_${tag}_${profileCount[tag] - 1}`,
					tag,
					batched: options?.batched ?? true,
					realtime: Boolean(options?.realtime),
					...this.config.config,
					globals,
				};

				// try to find an existing controller by similar configuration
				let controller = Object.keys(this.controller)
					.map((id) => this.controller[id])
					.filter((controller) => {
						return (
							JSON.stringify({
								batched: controller.config.batched,
								branch: controller.config.branch,
								globals: controller.config.globals,
								tag: controller.config.tag,
								realtime: controller.config.realtime,
							}) ==
							JSON.stringify({
								batched: controllerConfig.batched,
								branch: controllerConfig.branch,
								globals: controllerConfig.globals,
								tag: controllerConfig.tag,
								realtime: controllerConfig.realtime,
							})
						);
					})[0];

				if (!controller) {
					// no existing controller found of same configuration - creating a new controller
					const createRecommendationController = (await import('../create/createRecommendationController')).default;
					controller = createRecommendationController(
						{
							url: this.config.url,
							controller: controllerConfig,
							context,
							mode: this.config.mode,
						},
						{ client: this.client, tracker: this.tracker }
					);
				}

				this.uses.forEach((attachements) => controller.use(attachements));
				this.plugins.forEach((plugin) => controller.plugin(plugin.func, ...plugin.args));
				this.middleware.forEach((middleware) => controller.on(middleware.event, ...middleware.func));

				// run a search on the controller if it has not yet and it is not currently
				if (!controller.store.loaded && !controller.store.loading) {
					await controller.search();
				}

				controller.addTargeter(this.targeter);

				this.controller[controller.config.id] = controller;
				window.searchspring.controller = window.searchspring.controller || {};
				window.searchspring.controller[controller.config.id] = controller;

				const profileVars = controller.store.profile.display.templateParameters;
				const component = controller.store.profile.display.template?.component;

				if (controller.store.error) {
					//something went wrong
					//err was already logged - nothing to do.
					return;
				}

				if (!controller.store.profile.display.template) {
					this.logger.error(`profile '${tag}' found on the following element is missing a template!\n${elem?.outerHTML}`);
					return;
				}

				if (!profileVars) {
					this.logger.error(`profile '${tag}' found on the following element is missing templateParameters!\n${elem?.outerHTML}`);
					return;
				}

				if (!component) {
					this.logger.error(`profile '${tag}' found on the following element is missing a component!\n${elem?.outerHTML}`);
					return;
				}

				const RecommendationsComponent =
					this.config.components[component] &&
					((await this.config.components[component]()) as React.ElementType<{
						controller: RecommendationController;
					}>);

				if (!RecommendationsComponent) {
					this.logger.error(
						`profile '${tag}' found on the following element is expecting component mapping for '${component}' - verify instantiator config.\n${elem?.outerHTML}`
					);
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

	public on(event: string, ...func: Middleware<unknown>[]): void {
		this.middleware.push({ event, func });
	}

	public use(attachments: Attachments): void {
		this.uses.push(attachments);
	}
}
