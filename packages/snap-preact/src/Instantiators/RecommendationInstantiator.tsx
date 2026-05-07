import { render } from 'preact';
import deepmerge from 'deepmerge';

import { AppMode, DomTargeter, getContext } from '@searchspring/snap-toolbox';
import { Client } from '@searchspring/snap-client';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import type { ClientConfig, ClientGlobals, RecommendRequestModel, RecommendationRequestFilterModel } from '@searchspring/snap-client';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { AbstractController, RecommendationController, Attachments, ContextVariables } from '@searchspring/snap-controller';
import type { BeaconSettings, VariantConfig } from '@searchspring/snap-store-mobx';
import type { Middleware } from '@searchspring/snap-event-manager';
import type { Target } from '@searchspring/snap-toolbox';
import { createRecommendationController } from '../create';

export type RecommendationInstantiatorConfig = {
	mode?: keyof typeof AppMode | AppMode;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	components: {
		[name: string]: () => Promise<any> | any;
	};
	config?: {
		branch?: string;
		realtime?: boolean;
		batched?: boolean;
		limit?: number;
		variants?: VariantConfig;
		beacon?: BeaconSettings;
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

type ExtendedRecommendationProfileTarget = Target & {
	profile?: ProfileSpecificProfile;
	order?: number;
};

const DEFAULT_BRANCH = 'production';
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
			this.config.config = this.config.config || {};
			this.config.config.branch = DEFAULT_BRANCH;
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

		// script block targeter for "grouped" and "legacy" blocks
		this.targeter = new DomTargeter(
			[
				{
					selector: `${
						this.config.selector || 'script[type="searchspring/recommend"], script[type="searchspring/personalized-recommendations"]'
					}, script[type="searchspring/recommend"][profile="email"]`,
					autoRetarget: true,
					clickRetarget: true,
					navigationRetarget: true,
					emptyTarget: false,
				},
				{
					selector: 'script[type="searchspring/recommendations"]',
					autoRetarget: true,
					clickRetarget: true,
					navigationRetarget: true,
					emptyTarget: false,
				},
			],
			async (target: Target, elem: Element | undefined) => {
				this.cleanupStaleControllers();

				const scriptElement = elem as HTMLScriptElement;
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
					scriptElement
				);

				if (elemContext.profiles && elemContext.profiles.length) {
					// using the "grouped block" integration structure

					// type the new profile specific integration context variables
					const scriptContextProfiles = elemContext.profiles as ProfileSpecificProfile[];
					const scriptContextGlobals = elemContext.globals as ProfileSpecificGlobals | undefined;

					// grab from globals
					const requestGlobals: Partial<RecommendRequestModel> = {
						...defined({
							blockedItems: scriptContextGlobals?.blockedItems,
							filters: scriptContextGlobals?.filters,
							cart: scriptContextGlobals?.cart && getArrayFunc(scriptContextGlobals.cart),
							products: scriptContextGlobals?.products,
							shopper: scriptContextGlobals?.shopper?.id,
							batchId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
						}),
					};

					// create a per-profile DomTargeter for each profile so each controller
					// gets its own targeter tracking its specific element
					scriptContextProfiles.forEach((profile, index) => {
						if (profile.selector) {
							const profileTarget: ExtendedRecommendationProfileTarget = {
								selector: profile.selector,
								autoRetarget: true,
								profile,
								order: index,
							};

							// track the controller for this profile so multiple matched elements share it
							let profileControllerPromise: Promise<RecommendationController | undefined> | undefined;

							new DomTargeter(
								[profileTarget],
								async (
									target: ExtendedRecommendationProfileTarget,
									targetElem: Element | undefined,
									_originalElem?: Element,
									targeter?: DomTargeter
								) => {
									// skip retarget if the source script element was removed and release the current target
									if (!scriptElement.isConnected) {
										if (targetElem) {
											targeter?.releaseTargets([targetElem]);
										}
										return;
									}

									if (target.profile?.profile || target.profile?.tag) {
										const profileRequestGlobals: RecommendRequestModel = {
											...requestGlobals,
											profile: { ...target.profile?.options, order: target.order },
											tag: target.profile.tag! || target.profile.profile!, // have to support both tag and profile due to having profile at release, but will favor tag
										};
										const profileContext: ContextVariables = deepmerge(
											this.context,
											defined({ globals: scriptContextGlobals, profile: target.profile })
										);
										if (elemContext.custom) {
											profileContext.custom = elemContext.custom;
										}

										if (!profileControllerPromise) {
											// first element match — create the controller
											profileControllerPromise = readyTheController(
												this,
												targetElem,
												profileContext,
												profileCount,
												scriptElement,
												profileRequestGlobals,
												targeter!
											);
										} else {
											// subsequent element matches — reuse the existing controller and just render
											const controller = await profileControllerPromise;
											if (controller && targetElem) {
												renderController(this, controller, targetElem, scriptElement);
											}
										}
									}
								}
							);
						}
					});
				} else {
					// using the "legacy" integration structure
					const { profile, products, product, seed, filters, blockedItems, options, shopper, shopperId } = elemContext;
					const combinedProducts = [].concat(products || product || seed || []);
					const shopperIdentifier = [shopper, shopper?.id, shopperId, shopperId?.id].filter((val) => val && typeof val === 'string').pop();

					const profileRequestGlobals: Partial<RecommendRequestModel> = {
						tag: profile,
						...defined({
							products: combinedProducts.length ? combinedProducts : undefined,
							cart: elemContext.cart && getArrayFunc(elemContext.cart),
							shopper: shopperIdentifier,
							filters,
							blockedItems,
							profile: options,
						}),
					};

					// inject a render container before the script element
					const profileAttr = scriptElement.getAttribute('profile') || '';
					const recsContainer = document.createElement('div');
					recsContainer.setAttribute('searchspring-recommend', profileAttr);
					scriptElement.before(recsContainer);

					const legacyContext = deepmerge(this.context, elemContext);

					// create a per-element DomTargeter for the injected div (mirrors grouped block pattern)
					new DomTargeter(
						[{ selector: `[searchspring-recommend="${profileAttr}"]`, name: `legacy_${profile}_${profileCount[profile || ''] || 0}` }],
						async (_target: Target, targetElem: Element | undefined, _originalElem?: Element, targeter?: DomTargeter) => {
							// skip retarget if the source script element was removed and release the current target
							if (!scriptElement.isConnected) {
								if (targetElem) {
									targeter?.releaseTargets([targetElem]);
								}
								return;
							}

							readyTheController(this, targetElem, legacyContext, profileCount, scriptElement, profileRequestGlobals, targeter!);
						}
					);
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

	// cleanup to ensure we release controllers no longer rendering in the DOM (memory leak prevention for SPA's)
	public cleanupStaleControllers(): void {
		Object.keys(this.controller).forEach((id) => {
			const controller = this.controller[id];
			const targeters = Object.values(controller.targeters);

			const hasConnectedTarget = targeters.some((targeter) =>
				targeter.getTargetedElems().some((elem) => {
					const attr = elem.isConnected && elem.getAttribute('ss-controller-id');
					return attr === id;
				})
			);
			if (!hasConnectedTarget) {
				Object.keys(controller.targeters).forEach((targeterId) => controller.targeters[targeterId].destroy());
				controller.targeters = {};
				delete this.controller[id];
				if (window.searchspring?.controller) {
					delete window.searchspring.controller[id];
				}
			}
		});
	}
}

async function readyTheController(
	instance: RecommendationInstantiator,
	targetElem: Element | undefined,
	context: ContextVariables,
	profileCount: RecommendationProfileCounts,
	scriptElem: Element | undefined,
	controllerGlobals: Partial<RecommendRequestModel>,
	targeter: DomTargeter
): Promise<RecommendationController | undefined> {
	const { profile, batchId, cart, tag } = controllerGlobals;
	const batched = profile?.batched ?? controllerGlobals.batched ?? true;

	if (!tag) {
		// FEEDBACK: change message depending on script integration type (profile vs. legacy)
		instance.logger.warn(`'tag' is missing from <script> tag, skipping this profile`, scriptElem);
		return;
	}

	if (Array.isArray(cart)) {
		instance.tracker.cookies.cart.set(cart);
	}

	const globals: Partial<RecommendRequestModel> = deepmerge.all([
		instance.config.client?.globals || {},
		instance.config.config?.globals || {},
		controllerGlobals,
	]);

	const controllerConfigBase = {
		tag,
		batched: batched ?? true,
		realtime: Boolean(context.options?.realtime ?? context.profile?.options?.realtime),
		batchId: batchId,
		...instance.config.config,
		globals,
	};

	if (profile?.branch) {
		controllerConfigBase.branch = profile?.branch;
	}

	profileCount[tag] = profileCount[tag] + 1 || 1;
	const controllerConfig = {
		id: `recommend_${tag}_${profileCount[tag] - 1}`,
		...controllerConfigBase,
	};

	const controller = createRecommendationController(
		{
			url: instance.config.url,
			controller: controllerConfig,
			context,
			mode: instance.config.mode,
		},
		{ client: instance.client, tracker: instance.tracker }
	);

	// mark element with controller id so cleanupStaleControllers knows it's active
	if (targetElem) {
		targetElem.setAttribute('ss-controller-id', controller.id);
	}

	instance.uses.forEach((attachements) => controller.use(attachements));
	instance.plugins.forEach((plugin) => controller.plugin(plugin.func, ...plugin.args));
	instance.middleware.forEach((middleware) => controller.on(middleware.event, ...middleware.func));

	// add controller to instantiator and global namespace
	instance.controller[controller.config.id] = controller;
	window.searchspring.controller = window.searchspring.controller || {};
	window.searchspring.controller[controller.config.id] = controller;

	// register targeter on the controller for element tracking
	controller.addTargeter(targeter);

	// run a search on the controller if it is not currently
	if (!controller.store.loading) {
		await controller.search();
	}

	const profileVars = controller.store.profile.display.templateParameters;

	if (controller.store.error) {
		//something went wrong
		//err was already logged - nothing to do.
		return;
	}

	if (!controller.store.profile.display.template) {
		instance.logger.error(`profile '${tag}' found on the following element is missing a template!\n${scriptElem?.outerHTML}`);
		return;
	}

	if (!profileVars) {
		instance.logger.error(`profile '${tag}' found on the following element is missing templateParameters!\n${scriptElem?.outerHTML}`);
		return;
	}

	if (targetElem) {
		await renderController(instance, controller, targetElem, scriptElem);
	}

	return controller;
}

async function renderController(
	instance: RecommendationInstantiator,
	controller: RecommendationController,
	targetElem: Element,
	scriptElem: Element | undefined
) {
	// update the element with the controller id
	if (targetElem) {
		targetElem.setAttribute('ss-controller-id', controller.id);
	}

	const tag = controller.config.tag;
	const component = controller.store.profile.display.template?.component;

	if (!component) {
		instance.logger.error(`profile '${tag}' found on the following element is missing a component!\n${scriptElem?.outerHTML}`);
		return;
	}

	const RecommendationsComponent =
		instance.config.components[component] &&
		((await instance.config.components[component]()) as React.ElementType<{
			controller: RecommendationController;
		}>);

	if (!RecommendationsComponent) {
		instance.logger.error(
			`profile '${tag}' found on the following element is expecting component mapping for '${component}' - verify instantiator config.\n${scriptElem?.outerHTML}`
		);
		return;
	}

	setTimeout(() => {
		render(<RecommendationsComponent controller={controller} />, targetElem);
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
