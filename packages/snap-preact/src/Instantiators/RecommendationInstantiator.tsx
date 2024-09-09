import { render } from 'preact';
import deepmerge from 'deepmerge';

import { AppMode, DomTargeter, getContext } from '@searchspring/snap-toolbox';
import { Client } from '@searchspring/snap-client';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import type { ClientConfig, ClientGlobals, RecommendRequestModel } from '@searchspring/snap-client';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type {
	AbstractController,
	RecommendationController,
	Attachments,
	ContextVariables,
	RecommendationControllerConfig,
} from '@searchspring/snap-controller';
import type { VariantConfig } from '@searchspring/snap-store-mobx';
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
		variants?: VariantConfig;
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

type RecommendationProfileCounts = {
	[key: string]: number;
};

type ProfileSpecificProfile = {
	profile: string;
	target: string;
	options: Partial<RecommendRequestModel>;
};

type ProfileSpecificGlobals = {
	products?: string[];
	siteId?: string;
	cart?: string[] | (() => string[]);
	shopper?: { id?: string };
};

type ExtendedRecommendaitonTarget = Target & {
	context?: ProfileSpecificProfile;
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

	public uses: Attachments[] = [];
	public plugins: { func: (cntrlr: AbstractController, ...args: any) => Promise<void>; args: unknown[] }[] = [];
	public middleware: { event: string; func: Middleware<unknown>[] }[] = [];

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

		const profileCount: RecommendationProfileCounts = {};

		this.targeter = new DomTargeter(
			[
				{
					selector: this.config.selector || 'script[type="searchspring/recommend"], script[type="searchspring/personalized-recommendations"]',
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
				{
					selector: 'script[type="searchspring/recommendations"]',
					autoRetarget: true,
					clickRetarget: true,
					emptyTarget: false,
				},
			],
			async (target: Target, elem: Element | undefined, originalElem: Element | undefined) => {
				const elemContext = getContext(
					['shopperId', 'shopper', 'product', 'products', 'seed', 'cart', 'options', 'profile', 'profiles', 'globals', 'custom'],
					(originalElem || elem) as HTMLScriptElement
				);

				const context: ContextVariables = deepmerge(this.context, elemContext);

				const profiles = context.profiles as ProfileSpecificProfile[];
				const globals = context.globals as ProfileSpecificGlobals;

				// controller globals and shared things

				if (profiles && profiles.length) {
					const targetsArr: ExtendedRecommendaitonTarget[] = [];
					const batchId = Math.random();

					profiles.forEach((profile) => {
						if (profile.target) {
							const targetObj = {
								selector: profile.target,
								autoRetarget: true,
								clickRetarget: true,
								context: profile,
							};

							targetsArr.push(targetObj);
						}
					});

					new DomTargeter(targetsArr, async (target: ExtendedRecommendaitonTarget, elem: Element | undefined, originalElem: Element | undefined) => {
						const profileContext: ContextVariables = deepmerge(this.context, { ...target.context, globals });

						const { options: profileOptions } = profileContext;
						const controllerGlobals: Partial<RecommendRequestModel> = {};

						const tag = profileContext.profile;

						// context globals
						if (profileContext.globals) {
							if (profileContext.globals.siteId) {
								controllerGlobals.siteId = profileContext.globals.siteId;
							}
							if (profileContext.globals.products) {
								controllerGlobals.products = profileContext.globals.products;
							}
							if (profileContext.globals.blockedItems) {
								controllerGlobals.blockedItems = profileContext.globals.blockedItems;
							}
							if (profileContext.globals.cart) {
								controllerGlobals.cart = profileContext.globals.cart;
							}
						}

						if (profileOptions?.filters) {
							controllerGlobals.profileFilters = profileOptions.filters;
						}

						if (typeof profileOptions?.dedupe == 'boolean') {
							controllerGlobals.dedupe = profileOptions.dedupe;
						}

						readyTheController(this, elem, profileContext, profileCount, originalElem, batchId, controllerGlobals, tag);
					});
				} else {
					const { product, seed, options } = context;

					const controllerGlobals: any = {};

					const tag = elem?.getAttribute('searchspring-recommend');

					if (product || seed) {
						controllerGlobals.product = product || seed;
					}

					if (options?.siteId) {
						controllerGlobals.siteId = options.siteId;
					}

					if (options?.branch) {
						controllerGlobals.branch = options.branch;
					}

					if (options?.filters) {
						controllerGlobals.filters = options.filters;
					}

					readyTheController(this, elem, context, profileCount, originalElem, 1, controllerGlobals, tag);
				}
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

async function readyTheController(
	instance: RecommendationInstantiator,
	injectedElem: Element | undefined,
	context: ContextVariables,
	profileCount: RecommendationProfileCounts,
	elem: Element | undefined,
	batchId: number,
	controllerGlobals: Partial<RecommendationControllerConfig>,
	tag: string | null | undefined
) {
	const { shopper, shopperId, products, cart, options } = context;
	const blockedItems = context.options?.blockedItems;

	if (!tag) {
		// FEEDBACK: change message depending on script integration type (profile vs. legacy)
		instance.logger.warn(`'profile' attribute is missing from <script> tag, skipping this profile`, elem);
		return;
	}

	if (shopper || shopperId) {
		controllerGlobals.shopper = shopper?.id || shopperId;
	}
	if (products) {
		controllerGlobals.products = products;
	}
	if (options?.query) {
		controllerGlobals.query = options.query;
	}

	if (options?.categories) {
		controllerGlobals.categories = options.categories;
	}
	if (options?.brands) {
		controllerGlobals.brands = options.brands;
	}
	if (options?.limit && Number.isInteger(Number(options?.limit))) {
		controllerGlobals.limit = Number(options?.limit);
	}
	if (blockedItems && Array.isArray(blockedItems)) {
		controllerGlobals.blockedItems = blockedItems;
	}

	let cartContents;
	if (typeof cart === 'function') {
		try {
			const cartFuncContents = cart();
			if (Array.isArray(cartFuncContents)) {
				cartContents = cartFuncContents;
			}
		} catch (e) {
			instance.logger.warn(`Error getting cart contents from function`, e);
		}
	} else if (Array.isArray(cart)) {
		cartContents = cart;
	}
	if (Array.isArray(cartContents)) {
		instance.tracker.cookies.cart.set(cartContents);
		controllerGlobals.cart = instance.tracker.cookies.cart.get();
	}

	profileCount[tag] = profileCount[tag] + 1 || 1;

	const defaultGlobals = {
		limit: 20,
	};

	const globals = deepmerge(
		deepmerge(deepmerge(defaultGlobals, instance.config.client?.globals || {}), (instance.config.config?.globals as any) || {}),
		controllerGlobals
	);

	const controllerConfig = {
		id: `recommend_${tag}_${profileCount[tag] - 1}`,
		tag,
		batched: options?.batched ?? true,
		realtime: Boolean(options?.realtime),
		batchId: batchId,
		...instance.config.config,
		globals,
	};

	// try to find an existing controller by similar configuration
	let controller = Object.keys(instance.controller)
		.map((id) => instance.controller[id])
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
				url: instance.config.url,
				controller: controllerConfig,
				context,
				mode: instance.config.mode,
			},
			{ client: instance.client, tracker: instance.tracker }
		);
	}

	instance.uses.forEach((attachements) => controller.use(attachements));
	instance.plugins.forEach((plugin) => controller.plugin(plugin.func, ...plugin.args));
	instance.middleware.forEach((middleware) => controller.on(middleware.event, ...middleware.func));

	// run a search on the controller if it has not yet and it is not currently
	if (!controller.store.loaded && !controller.store.loading) {
		await controller.search();
	}

	controller.addTargeter(instance.targeter);

	instance.controller[controller.config.id] = controller;
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
		instance.logger.error(`profile '${tag}' found on the following element is missing a template!\n${elem?.outerHTML}`);
		return;
	}

	if (!profileVars) {
		instance.logger.error(`profile '${tag}' found on the following element is missing templateParameters!\n${elem?.outerHTML}`);
		return;
	}

	if (!component) {
		instance.logger.error(`profile '${tag}' found on the following element is missing a component!\n${elem?.outerHTML}`);
		return;
	}

	const RecommendationsComponent =
		instance.config.components[component] &&
		((await instance.config.components[component]()) as React.ElementType<{
			controller: RecommendationController;
		}>);

	if (!RecommendationsComponent) {
		instance.logger.error(
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
