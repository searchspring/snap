import { render } from 'preact';
import deepmerge from 'deepmerge';

import { AppMode, DomTargeter, getContext } from '@searchspring/snap-toolbox';
import { Client } from '@searchspring/snap-client';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import type { ClientConfig, ClientGlobals, RecommendRequestModel, RecommendationRequestFilterModel } from '@searchspring/snap-client';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { AbstractController, RecommendationController, Attachments, ContextVariables } from '@searchspring/snap-controller';
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
	custom?: any;
	options: Pick<RecommendRequestModel, 'siteId' | 'categories' | 'brands' | 'branch' | 'filters' | 'limit' | 'query' | 'dedupe'> & {
		realtime?: boolean;
	};
	profile?: string;
	tag?: string;
	selector: string;
};

type ProfileSpecificGlobals = {
	filters?: RecommendationRequestFilterModel[];
	blockedItems: string[];
	cart?: string[] | (() => string[]);
	products?: string[];
	shopper?: { id?: string };
};

type ExtendedRecommendaitonProfileTarget = Target & {
	profile?: ProfileSpecificProfile;
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
					selector: `${
						this.config.selector || 'script[type="searchspring/recommend"], script[type="searchspring/personalized-recommendations"]'
					}, script[type="searchspring/recommend"][profile="email"]`,
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
					[
						'shopperId',
						'shopper',
						'product',
						'products',
						'seed',
						'cart',
						'filters',
						'blockedItems',
						'options',
						'profile',
						'custom',
						'profiles',
						'globals',
					],
					(originalElem || elem) as HTMLScriptElement
				);

				if (elemContext.profiles && elemContext.profiles.length) {
					// using the "grouped block" integration structure

					// type the new profile specific integration context variables
					const scriptContextProfiles = elemContext.profiles as ProfileSpecificProfile[];
					const scriptContextGlobals = elemContext.globals as ProfileSpecificGlobals;

					// grab from globals
					const requestGlobals: Partial<RecommendRequestModel> = {
						...defined({
							blockedItems: scriptContextGlobals.blockedItems,
							filters: scriptContextGlobals.filters,
							cart: scriptContextGlobals.cart && getArrayFunc(scriptContextGlobals.cart),
							products: scriptContextGlobals.products,
							shopper: scriptContextGlobals.shopper?.id,
							batchId: Math.random(),
						}),
					};

					const targetsArr: ExtendedRecommendaitonProfileTarget[] = [];

					// build out the targets array for each profile
					scriptContextProfiles.forEach((profile) => {
						if (profile.selector) {
							const targetObj = {
								selector: profile.selector,
								autoRetarget: true,
								clickRetarget: true,
								profile,
							};

							targetsArr.push(targetObj);
						}
					});

					new DomTargeter(
						targetsArr,
						async (target: ExtendedRecommendaitonProfileTarget, elem: Element | undefined, originalElem: Element | undefined) => {
							if (target.profile?.profile || target.profile?.tag) {
								const profileRequestGlobals: RecommendRequestModel = {
									...requestGlobals,
									profile: target.profile?.options,
									tag: target.profile.tag! || target.profile.profile!, // have to support both tag and profile due to having profile at release, but will favor tag
								};
								const profileContext: ContextVariables = deepmerge(this.context, { globals: scriptContextGlobals, profile: target.profile });
								if (elemContext.custom) {
									profileContext.custom = elemContext.custom;
								}

								readyTheController(this, elem, profileContext, profileCount, originalElem, profileRequestGlobals);
							}
						}
					);
				} else {
					// using the "legacy" integration structure
					const { profile, products, product, seed, filters, blockedItems, options, shopper, shopperId } = elemContext;

					const profileRequestGlobals: Partial<RecommendRequestModel> = {
						tag: profile,
						...defined({
							products: products || (product && [product]) || (seed && [seed]),
							cart: elemContext.cart && getArrayFunc(elemContext.cart),
							shopper: shopper?.id || shopperId,
							filters,
							blockedItems,
							profile: options,
						}),
					};

					readyTheController(this, elem, deepmerge(this.context, elemContext), profileCount, originalElem, profileRequestGlobals);
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
	controllerGlobals: Partial<RecommendRequestModel>
) {
	const { profile, batchId, cart, tag } = controllerGlobals;
	const batched = (profile?.batched || controllerGlobals.batched) ?? true;

	if (!tag) {
		// FEEDBACK: change message depending on script integration type (profile vs. legacy)
		instance.logger.warn(`'tag' is missing from <script> tag, skipping this profile`, elem);
		return;
	}

	if (Array.isArray(cart)) {
		instance.tracker.cookies.cart.set(cart);
	}

	profileCount[tag] = profileCount[tag] + 1 || 1;

	const globals: Partial<RecommendRequestModel> = deepmerge.all([
		instance.config.client?.globals || {},
		instance.config.config?.globals || {},
		controllerGlobals,
	]);

	const controllerConfig = {
		id: `recommend_${tag}_${profileCount[tag] - 1}`,
		tag,
		batched: batched ?? true,
		realtime: Boolean(context.options?.realtime ?? context.profile?.options?.realtime),
		batchId: batchId,
		...instance.config.config,
		globals,
	};

	if (profile?.branch) {
		controllerConfig.branch = profile?.branch;
	}

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

		instance.uses.forEach((attachements) => controller.use(attachements));
		instance.plugins.forEach((plugin) => controller.plugin(plugin.func, ...plugin.args));
		instance.middleware.forEach((middleware) => controller.on(middleware.event, ...middleware.func));
	}

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

function getArrayFunc(arrayOrFunc: string[] | (() => string[])): string[] {
	if (typeof arrayOrFunc === 'function') {
		try {
			const funcContents = arrayOrFunc();
			if (Array.isArray(funcContents)) {
				return funcContents;
			}
		} catch (e) {
			// function didn't return an array
		}
	} else if (Array.isArray(arrayOrFunc)) {
		return arrayOrFunc;
	}

	return [];
}

type DefinedProps = {
	[key: string]: any;
};

export function defined(properties: Record<string, any>): DefinedProps {
	const definedProps: DefinedProps = {};

	Object.keys(properties).map((key) => {
		if (properties[key] !== undefined) {
			definedProps[key] = properties[key];
		}
	});

	return definedProps;
}
