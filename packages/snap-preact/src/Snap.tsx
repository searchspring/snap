/** @jsx h */
import { h, render } from 'preact';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import { configure as configureMobx } from 'mobx';

import { Client } from '@searchspring/snap-client';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { AppMode, version, getContext, DomTargeter, url, cookies, featureFlags } from '@searchspring/snap-toolbox';
import { ControllerTypes } from '@searchspring/snap-controller';
import { EventManager } from '@searchspring/snap-event-manager';

import { getInitialUrlState } from './getInitialUrlState/getInitialUrlState';

import type { ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type {
	Controllers,
	AbstractController,
	AutocompleteController,
	SearchControllerConfig,
	AutocompleteControllerConfig,
	FinderControllerConfig,
	RecommendationControllerConfig,
	ControllerConfigs,
	ContextVariables,
} from '@searchspring/snap-controller';
import type { TrackerConfig, TrackerGlobals, TrackErrorEvent } from '@searchspring/snap-tracker';
import type { Target, OnTarget } from '@searchspring/snap-toolbox';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';

import { default as createSearchController } from './create/createSearchController';
import { configureSnapFeatures } from './configureSnapFeatures';
import { RecommendationInstantiator, RecommendationInstantiatorConfig } from './Instantiators/RecommendationInstantiator';
import type { SnapControllerServices, SnapControllerConfig, InitialUrlConfig } from './types';
import { setupEvents } from './setupEvents';

// configure MobX
configureMobx({ useProxies: 'never', isolateGlobalState: true, enforceActions: 'never' });

export const BRANCH_COOKIE = 'ssBranch';
export const BRANCH_PARAM = 'searchspring-preview';
export const DEV_COOKIE = 'ssDev';
export const STYLESHEET_CLASSNAME = 'ss-snap-bundle-styles';

type ExtendedTarget = Target & {
	name?: string;
	controller?: AbstractController;
	component?: () => Promise<any> | any;
	skeleton?: () => Promise<any> | any;
	props?: {
		[propName: string]: any;
	};
	onTarget?: OnTarget;
	prefetch?: boolean;
	renderAfterSearch?: boolean;
};

type SnapFeatures = {
	integratedSpellCorrection?: {
		enabled?: boolean;
	};
};

export type SnapConfig = {
	features?: SnapFeatures;
	mode?: keyof typeof AppMode | AppMode;
	context?: ContextVariables;
	url?: UrlTranslatorConfig;
	client?: {
		globals?: Partial<ClientGlobals>;
		config?: ClientConfig;
	};
	tracker?: {
		globals?: TrackerGlobals;
		config?: TrackerConfig;
	};
	instantiators?: {
		recommendation?: RecommendationInstantiatorConfig;
	};
	controllers?: {
		search?: {
			config: SearchControllerConfig;
			targeters?: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig & {
				initial?: InitialUrlConfig;
			};
			context?: ContextVariables;
		}[];
		autocomplete?: {
			config: AutocompleteControllerConfig;
			targeters?: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig;
			context?: ContextVariables;
		}[];
		finder?: {
			config: FinderControllerConfig;
			targeters?: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig;
			context?: ContextVariables;
		}[];
		recommendation?: {
			config: RecommendationControllerConfig;
			targeters?: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig;
			context?: ContextVariables;
		}[];
	};
};

type SnapServices = {
	client?: Client;
	tracker?: Tracker;
	logger?: Logger;
};

const SESSION_ATTRIBUTION = 'ssAttribution';

const COMPONENT_ERROR = `Uncaught Error - Invalid value passed as the component.
This usually happens when you pass a JSX Element, and not a function that returns the component, in the snap config. 
		
		instead of - 

	targeters: [
		{
			selector: '#searchspring-content',
			hideTarget: true,
			component: <Content/>,
		},
	]

		or - 

	targeters: [
		{
			selector: '#searchspring-content',
			hideTarget: true,
			component: Content,
		},
	]

		please try - 

	targeters: [
		{
			selector: '#searchspring-content',
			hideTarget: true,
			component: () => Content
		},
	]

The error above happened in the following targeter in the Snap Config`;
export class Snap {
	private mode = AppMode.production;
	private config: SnapConfig;
	private _instantiatorPromises: {
		[instantiatorId: string]: Promise<RecommendationInstantiator>;
	} = {};
	private _controllerPromises: {
		[controllerConfigId: string]: Promise<Controllers>;
	} = {};

	public logger!: Logger;
	public client!: Client;
	public tracker!: Tracker;
	public context: ContextVariables;
	public controllers: {
		[controllerConfigId: string]: Controllers;
	} = {};

	public eventManager: EventManager;

	public getInstantiator = (id: string): Promise<RecommendationInstantiator> => {
		return this._instantiatorPromises[id] || Promise.reject(`getInstantiator could not find instantiator with id: ${id}`);
	};

	public getController = (id: string): Promise<Controllers> => {
		return this._controllerPromises[id] || Promise.reject(`getController could not find controller with id: ${id}`);
	};

	public getControllers = (...controllerIds: string[]): Promise<Controllers[]> => {
		const getControllerPromises: Promise<Controllers>[] = [];
		controllerIds.forEach((id) => getControllerPromises.push(this.getController(id)));
		return Promise.all(getControllerPromises);
	};

	// exposed method used for creating controllers dynamically - calls _createController()
	public createController = async (
		type: keyof typeof ControllerTypes,
		config: ControllerConfigs,
		services?: SnapControllerServices,
		urlConfig?: UrlTranslatorConfig,
		context?: ContextVariables,
		callback?: (value?: Controllers | PromiseLike<Controllers>) => void | Promise<void>
	): Promise<Controllers> => {
		if (typeof this._controllerPromises[config.id] != 'undefined') {
			throw new Error(`Controller with id '${config.id}' is already defined`);
		}

		this._controllerPromises[config.id] = new Promise((resolve) =>
			this._createController(type, config, services, urlConfig, context, async (cntrlr) => {
				if (typeof callback == 'function') await callback(cntrlr);
				resolve(cntrlr);
			})
		);

		return this._controllerPromises[config.id];
	};

	// internal use method that creates controllers without verifying if id is in use first
	private _createController = async (
		type: keyof typeof ControllerTypes,
		config: ControllerConfigs,
		services?: SnapControllerServices,
		urlConfig?: UrlTranslatorConfig,
		context?: ContextVariables,
		callback?: (cntrlr: Controllers) => void | Promise<void>
	): Promise<Controllers> => {
		let importPromise;
		switch (type) {
			case ControllerTypes.autocomplete:
				importPromise = import('./create/createAutocompleteController');
				break;
			case ControllerTypes.finder:
				importPromise = import('./create/createFinderController');
				break;
			case ControllerTypes.recommendation:
				importPromise = import('./create/createRecommendationController');
				break;
			case ControllerTypes.search:
			default:
				importPromise = import('./create/createSearchController');
				break;
		}

		// @ts-ignore - we know the config is correct, but complicated typing
		const creationFunc: (config: SnapControllerConfig, services: SnapControllerServices) => Controllers = (await importPromise).default;

		if (!this.controllers[config.id]) {
			window.searchspring.controller = window.searchspring.controller || {};
			window.searchspring.controller[config.id] = this.controllers[config.id] = creationFunc(
				{
					mode: this.mode,
					url: deepmerge(this.config.url || {}, urlConfig || {}),
					controller: config,
					context: deepmerge(this.context || {}, context || {}),
				},
				{
					client: services?.client || this.client,
					store: services?.store,
					urlManager: services?.urlManager,
					eventManager: services?.eventManager,
					profiler: services?.profiler,
					logger: services?.logger,
					tracker: services?.tracker || this.tracker,
				}
			);
		}

		if (callback) {
			await callback(this.controllers[config.id]);
		}

		return this.controllers[config.id];
	};

	public handlers = {
		error: (event: ErrorEvent): void => {
			try {
				const { filename } = event;
				if (filename.includes('snapui.searchspring.io') && filename.endsWith('.js') && this.tracker.track.error) {
					const {
						colno,
						lineno,
						error: { stack },
						message,
						timeStamp,
					} = event;
					const href = window.location.href;

					const beaconPayload: TrackErrorEvent = {
						href,
						filename,
						stack,
						message,
						colno,
						lineno,
						errortimestamp: timeStamp,
					};
					this.tracker.track.error(beaconPayload);
				}
			} catch (e) {
				// prevent error metrics from breaking the app
			}
		},
	};

	constructor(config: SnapConfig, services?: SnapServices) {
		window.removeEventListener('error', this.handlers.error);
		window.addEventListener('error', this.handlers.error);

		this.config = config;

		this.eventManager = setupEvents();

		let globalContext: ContextVariables = {};
		try {
			// get global context
			globalContext = getContext(['shopper', 'config', 'merchandising', 'siteId', 'currency']);
		} catch (err) {
			console.error('Snap failed to find global context');
		}

		// merge configs - but only merge plain objects
		this.config = deepmerge(this.config || {}, (globalContext.config as SnapConfig) || {}, {
			isMergeableObject: isPlainObject,
		});

		this.context = deepmerge(this.config.context || {}, globalContext || {}, {
			isMergeableObject: isPlainObject,
		});

		if (!this.config?.client?.globals?.siteId && this.context.siteId) {
			const defaultClientConfig = {
				globals: {
					siteId: this.context.siteId,
				},
			};

			this.config.client = deepmerge(this.config.client || {}, defaultClientConfig);
		}

		if ((!services?.client || !services?.tracker) && !this.config?.client?.globals?.siteId) {
			throw new Error(`Snap: config provided must contain a valid config.client.globals.siteId value`);
		}

		// segmented merchandising context -> client globals
		if (this.config.client?.globals && this.context.merchandising?.segments) {
			if (this.config.client.globals?.merchandising) {
				this.config.client.globals.merchandising.segments = deepmerge(
					this.config.client.globals.merchandising.segments,
					this.context.merchandising.segments
				);
			} else {
				this.config.client.globals.merchandising = {
					segments: this.context.merchandising.segments,
				};
			}
		}

		try {
			const urlParams = url(window.location.href);
			const branchOverride = urlParams?.params?.query[BRANCH_PARAM] || cookies.get(BRANCH_COOKIE);
			const cookieDomain =
				(typeof window !== 'undefined' && window.location.hostname && '.' + window.location.hostname.replace(/^www\./, '')) || undefined;
			/* app mode priority:
				1. node env
				2. config
				3. override via query param / cookie
			*/

			// node env
			if (process.env.NODE_ENV && Object.values(AppMode).includes(process.env.NODE_ENV as AppMode)) {
				this.mode = process.env.NODE_ENV as AppMode;
			}

			// config
			if (this.config.mode && Object.values(AppMode).includes(this.config.mode as AppMode)) {
				this.mode = this.config.mode as AppMode;
			}

			// query param / cookiev override
			if ((urlParams?.params?.query && 'dev' in urlParams.params.query) || !!cookies.get(DEV_COOKIE)) {
				if (urlParams?.params.query?.dev == 'false' || urlParams?.params.query?.dev == '0') {
					cookies.unset(DEV_COOKIE, cookieDomain);
					this.mode = AppMode.production;
				} else {
					cookies.set(DEV_COOKIE, '1', 'Lax', 0, cookieDomain);
					this.mode = AppMode.development;
				}
			}

			// client mode uses client config over snap config
			if (this.config.client) {
				this.config.client.config = this.config.client.config || {};
				this.config.client.config.mode = this.config.client.config.mode || this.mode;
			}

			// feature check block
			configureSnapFeatures(this.config);

			this.client = services?.client || new Client(this.config.client!.globals as ClientGlobals, this.config.client!.config);
			this.logger = services?.logger || new Logger({ prefix: 'Snap Preact ', mode: this.mode });

			// create tracker
			let trackerGlobals = this.config.tracker?.globals || (this.config.client!.globals as ClientGlobals);

			if (this.context.currency?.code) {
				trackerGlobals = deepmerge(trackerGlobals || {}, {
					currency: this.context.currency,
				});
			}

			const trackerConfig = deepmerge(this.config.tracker?.config || {}, { framework: 'preact', mode: this.mode });
			this.tracker = services?.tracker || new Tracker(trackerGlobals, trackerConfig);

			// check for tracking attribution in URL ?ss_attribution=type:id
			const sessionAttribution = window.sessionStorage?.getItem(SESSION_ATTRIBUTION);
			if (urlParams?.params?.query?.ss_attribution) {
				const attribution = urlParams.params.query.ss_attribution.split(':');
				const [type, id] = attribution;
				if (type && id) {
					this.tracker.updateContext('attribution', { type, id });
				}
				// save to session storage
				window.sessionStorage?.setItem(SESSION_ATTRIBUTION, urlParams.params.query.ss_attribution);
			} else if (sessionAttribution) {
				const [type, id] = sessionAttribution.split(':');
				if (type && id) {
					this.tracker.updateContext('attribution', { type, id });
				}
			}

			// log version
			this.logger.imageText({
				url: 'https://snapui.searchspring.io/favicon.svg',
				text: `[${version}]`,
				style: `color: ${this.logger.colors.indigo}; font-weight: bold;`,
			});

			// handle branch override
			if (branchOverride && !document.querySelector(`script[${BRANCH_COOKIE}]`)) {
				this.logger.warn(`:: loading branch override ~ '${branchOverride}' ...`);

				// set a cookie with branch
				if (featureFlags.cookies) {
					cookies.set(BRANCH_COOKIE, branchOverride, 'Lax', 3600000, cookieDomain); // 1 hour
				} else {
					this.logger.warn('Cookies are not supported/enabled by this browser, branch overrides will not persist!');
				}

				// get the path and siteId from the current bundle script in case its not the same as the client config
				let path = `https://snapui.searchspring.io/${this.config.client?.globals?.siteId}/`;
				const script: HTMLScriptElement | null = document.querySelector('script[src*="//snapui.searchspring.io"]');

				if (script) {
					const scriptRoot = script.getAttribute('src')!.match(/\/\/snapui.searchspring.io\/[a-zA-Z0-9]{6}\//);
					if (scriptRoot) {
						path = scriptRoot.toString();
					}
				}

				// append script with new branch in path
				const branchScript = document.createElement('script');
				const src = `${path}${branchOverride}/bundle.js`;
				branchScript.src = src;
				branchScript.setAttribute(BRANCH_COOKIE, branchOverride);

				new DomTargeter(
					[
						{
							selector: 'body',
							inject: {
								action: 'append', // before, after, append, prepend
								element: () => {
									const branchContainer = document.createElement('div');
									branchContainer.id = 'searchspring-branch-override';
									return branchContainer;
								},
							},
						},
					],
					async (target: Target, elem: Element) => {
						const props: {
							details?: any;
							error?: any;
						} = {};

						try {
							const getBundleDetails = (await import('./getBundleDetails/getBundleDetails')).getBundleDetails;
							props.details = await getBundleDetails(src);
						} catch (err) {
							props.error = err;
						}

						const BranchOverride = (await import('./components/BranchOverride')).BranchOverride;
						render(
							<BranchOverride
								{...props}
								name={branchOverride}
								onRemoveClick={() => {
									cookies.unset(BRANCH_COOKIE, cookieDomain);
									const urlState = url(window.location.href);
									delete urlState?.params.query[BRANCH_PARAM];

									const newUrl = urlState?.url();
									if (newUrl && newUrl != window.location.href) {
										window.location.href = newUrl;
									} else {
										window.location.reload();
									}
								}}
							/>,
							elem
						);

						// reset the global searchspring object
						try {
							delete window.searchspring;
						} catch (e) {
							window.searchspring = undefined;
						}

						document.head.appendChild(branchScript);
					}
				);

				// remove snap bundle styles
				document.querySelectorAll(`.${STYLESHEET_CLASSNAME}`).forEach((el) => el.remove());

				// prevent further instantiation of config
				throw 'branch override';
			}
		} catch (e) {
			if (e == 'branch override') {
				throw `${this.logger.emoji.bang} Snap instantiation halted - using branch override.`;
			}

			this.logger.error(e);
		}

		// bind to window global
		window.searchspring = window.searchspring || {};
		window.searchspring.context = this.context;
		if (this.client) window.searchspring.client = this.client;

		if (this.eventManager) {
			window.searchspring.on = (event: string, ...func: any) => {
				this.eventManager.on(event, ...func);
			};

			window.searchspring.fire = (event: string, ...func: any) => {
				this.eventManager.fire(event, ...func);
			};
		}

		// autotrack shopper id from the context
		if (this.context?.shopper?.id) {
			this.tracker.track.shopper.login({
				id: this.context.shopper.id,
			});
		}

		// auto populate cart cookie from the context
		if (this.context?.shopper?.cart) {
			const cart = this.context.shopper.cart;
			if (Array.isArray(cart)) {
				const cartItems = cart.filter((item) => item?.sku || item?.childSku).map((item) => (item?.sku || item?.childSku || '').trim());
				this.tracker.cookies.cart.set(cartItems);
			}
		}

		// create controllers
		Object.keys(this.config?.controllers || {}).forEach((type) => {
			switch (type) {
				case 'search': {
					this.config.controllers![type]!.forEach((controller, index) => {
						try {
							if (typeof this._controllerPromises[controller.config.id] != 'undefined') {
								this.logger.error(`Controller with id '${controller.config.id}' is already defined`);
								return;
							}

							const cntrlr = createSearchController(
								{
									mode: this.mode,
									url: deepmerge(this.config.url || {}, controller.url || {}),
									controller: controller.config,
									context: deepmerge(this.context || {}, controller.context || {}),
								},
								{
									client: controller.services?.client || this.client,
									store: controller.services?.store,
									urlManager: controller.services?.urlManager,
									eventManager: controller.services?.eventManager,
									profiler: controller.services?.profiler,
									logger: controller.services?.logger,
									tracker: controller.services?.tracker || this.tracker,
								}
							);

							window.searchspring.controller = window.searchspring.controller || {};
							window.searchspring.controller[cntrlr.config.id] = this.controllers[cntrlr.config.id] = cntrlr;
							this._controllerPromises[cntrlr.config.id] = new Promise((resolve) => resolve(cntrlr));

							let searchPromise: Promise<void> | null = null;

							const runSearch = async () => {
								if (!searchPromise) {
									// handle custom initial UrlManager state
									if (controller.url?.initial) {
										getInitialUrlState(controller.url.initial, cntrlr.urlManager).go({ history: 'replace' });
									}

									searchPromise = this.controllers[controller.config.id].search();
								}

								return searchPromise;
							};

							const targetFunction = async (target: ExtendedTarget, elem: Element, originalElem: Element) => {
								const targetFunctionPromises: Promise<any>[] = [];
								if (target.renderAfterSearch) {
									targetFunctionPromises.push(runSearch());
								} else {
									targetFunctionPromises.push(Promise.resolve());
									runSearch();
								}

								const onTarget = target.onTarget as OnTarget;
								onTarget && (await onTarget(target, elem, originalElem));

								try {
									targetFunctionPromises.push(target.component!());
									const [_, Component] = await Promise.all(targetFunctionPromises);
									setTimeout(() => {
										render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
									});
								} catch (err) {
									this.logger.error(err);
									this.logger.error(COMPONENT_ERROR, target);
								}
							};

							controller?.targeters?.forEach((target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}

								if (target.prefetch) {
									runSearch();
								}

								cntrlr.createTargeter({ controller: cntrlr, ...target }, async (target: ExtendedTarget, elem: Element, originalElem?: Element) => {
									if (target && target.skeleton && elem) {
										const Skeleton = await target.skeleton!();
										setTimeout(() => {
											render(<Skeleton />, elem);
										});
									}
									await targetFunction(target, elem, originalElem!);
								});
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});
					break;
				}

				case 'autocomplete': {
					this.config.controllers![type]!.forEach((controller, index) => {
						if (typeof this._controllerPromises[controller.config.id] != 'undefined') {
							this.logger.error(`Controller with id '${controller.config.id}' is already defined`);
							return;
						}

						this._controllerPromises[controller.config.id] = new Promise(async (resolve) => {
							try {
								let bound = false;
								const runBind = () => {
									if (!bound) {
										bound = true;
										setTimeout(() => {
											(this.controllers[controller.config.id] as AutocompleteController).bind();
										});
									}
								};

								const targetFunction = async (target: ExtendedTarget, elem: Element, originalElem: Element) => {
									const onTarget = target.onTarget as OnTarget;
									onTarget && (await onTarget(target, elem, originalElem));

									try {
										const Component = (await target.component!()) as React.ElementType<{
											controller: AutocompleteController;
											input: HTMLInputElement | string | Element;
										}>;

										setTimeout(() => {
											render(
												<Component
													controller={this.controllers[controller.config.id] as AutocompleteController}
													input={originalElem}
													{...target.props}
												/>,
												elem
											);
										});
									} catch (err) {
										this.logger.error(err);
										this.logger.error(COMPONENT_ERROR, target);
									}
								};

								if (!controller?.targeters || controller?.targeters.length === 0) {
									await this._createController(
										ControllerTypes.autocomplete,
										controller.config,
										controller.services,
										controller.url,
										controller.context,
										(cntrlr) => {
											if (cntrlr) resolve(cntrlr);
										}
									);

									runBind();
								}

								controller?.targeters?.forEach((target, target_index) => {
									if (!target.selector) {
										throw new Error(`Targets at index ${target_index} missing selector value (string).`);
									}
									if (!target.component) {
										throw new Error(`Targets at index ${target_index} missing component value (Component).`);
									}

									const targeter = new DomTargeter(
										[
											{
												inject: {
													action: 'after', // before, after, append, prepend
													element: () => {
														const acContainer = document.createElement('div');
														acContainer.className = 'ss__autocomplete--target';
														acContainer.addEventListener('click', (e) => {
															e.stopPropagation();
														});
														return acContainer;
													},
												},
												...target,
											},
										],
										async (target: Target, elem: Element, originalElem?: Element) => {
											const cntrlr = await this._createController(
												ControllerTypes.autocomplete,
												controller.config,
												controller.services,
												controller.url,
												controller.context,
												(cntrlr) => {
													if (cntrlr) resolve(cntrlr);
												}
											);
											runBind();
											targetFunction({ controller: cntrlr, ...target }, elem, originalElem!);
											cntrlr.addTargeter(targeter);
										}
									);
								});
							} catch (err) {
								this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
							}
						});
					});
					break;
				}

				case 'finder': {
					this.config.controllers![type]!.forEach((controller, index) => {
						if (typeof this._controllerPromises[controller.config.id] != 'undefined') {
							this.logger.error(`Controller with id '${controller.config.id}' is already defined`);
							return;
						}

						this._controllerPromises[controller.config.id] = new Promise((resolve) => {
							try {
								let searched = false;
								const runSearch = () => {
									if (!searched) {
										this.controllers[controller.config.id].search();
										searched = true;
									}
								};
								const targetFunction = async (target: ExtendedTarget, elem: Element, originalElem: Element) => {
									const onTarget = target.onTarget as OnTarget;
									onTarget && (await onTarget(target, elem, originalElem));

									try {
										const Component = await target.component!();

										setTimeout(() => {
											render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
										});
									} catch (err) {
										this.logger.error(err);
										this.logger.error(COMPONENT_ERROR, target);
									}
								};

								if (!controller?.targeters || controller?.targeters.length === 0) {
									this._createController(
										ControllerTypes.finder,
										controller.config,
										controller.services,
										controller.url,
										controller.context,
										(cntrlr) => {
											if (cntrlr) resolve(cntrlr);
										}
									);
								}

								controller?.targeters?.forEach((target, target_index) => {
									if (!target.selector) {
										throw new Error(`Targets at index ${target_index} missing selector value (string).`);
									}
									if (!target.component) {
										throw new Error(`Targets at index ${target_index} missing component value (Component).`);
									}
									const targeter = new DomTargeter([{ ...target }], async (target: Target, elem: Element, originalElem?: Element) => {
										const cntrlr = await this._createController(
											ControllerTypes.finder,
											controller.config,
											controller.services,
											controller.url,
											controller.context,
											(cntrlr) => {
												if (cntrlr) resolve(cntrlr);
											}
										);
										runSearch();
										targetFunction({ controller: cntrlr, ...target }, elem, originalElem!);
										cntrlr.addTargeter(targeter);
									});
								});
							} catch (err) {
								this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
							}
						});
					});
					break;
				}

				case 'recommendation': {
					this.config.controllers![type]!.forEach((controller, index) => {
						if (typeof this._controllerPromises[controller.config.id] != 'undefined') {
							this.logger.error(`Controller with id '${controller.config.id}' is already defined`);
							return;
						}

						this._controllerPromises[controller.config.id] = new Promise((resolve) => {
							try {
								let searched = false;
								const runSearch = () => {
									if (!searched) {
										this.controllers[controller.config.id].search();
										searched = true;
									}
								};
								const targetFunction = async (target: ExtendedTarget, elem: Element, originalElem: Element) => {
									const onTarget = target.onTarget as OnTarget;
									onTarget && (await onTarget(target, elem, originalElem));

									try {
										const Component = await target.component!();

										setTimeout(() => {
											render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
										});
									} catch (err) {
										this.logger.error(err);
										this.logger.error(COMPONENT_ERROR, target);
									}
								};

								if (!controller?.targeters || controller?.targeters.length === 0) {
									this._createController(
										ControllerTypes.recommendation,
										controller.config,
										controller.services,
										controller.url,
										controller.context,
										(cntrlr) => {
											if (cntrlr) resolve(cntrlr);
										}
									);
								}

								controller?.targeters?.forEach((target, target_index) => {
									if (!target.selector) {
										throw new Error(`Targets at index ${target_index} missing selector value (string).`);
									}
									if (!target.component) {
										throw new Error(`Targets at index ${target_index} missing component value (Component).`);
									}
									const targeter = new DomTargeter([{ ...target }], async (target: Target, elem: Element, originalElem?: Element) => {
										const cntrlr = await this._createController(
											ControllerTypes.recommendation,
											controller.config,
											controller.services,
											controller.url,
											controller.context,
											(cntrlr) => {
												if (cntrlr) resolve(cntrlr);
											}
										);
										runSearch();
										targetFunction({ controller: cntrlr, ...target }, elem, originalElem!);
										cntrlr.addTargeter(targeter);
									});
								});
							} catch (err) {
								this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
							}
						});
					});
					break;
				}
			}
		});

		// create instantiators
		if (this.config?.instantiators?.recommendation) {
			try {
				this._instantiatorPromises.recommendation = import('./Instantiators/RecommendationInstantiator').then(({ RecommendationInstantiator }) => {
					this.config.instantiators!.recommendation!.mode = this.config.instantiators!.recommendation!.mode || this.mode;
					return new RecommendationInstantiator(
						this.config.instantiators!.recommendation!,
						{
							client: this.client,
							tracker: this.tracker,
							logger: this.logger,
						},
						this.context
					);
				});
			} catch (err) {
				this.logger.error(`Failed to create Recommendations Instantiator.`, err);
			}
		}
	}
}
