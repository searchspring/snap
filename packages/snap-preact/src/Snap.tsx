import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import { h, render } from 'preact';
import { Client } from '@searchspring/snap-client';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { AppMode, version, getContext, DomTargeter, url, cookies, featureFlags } from '@searchspring/snap-toolbox';
import { ControllerTypes } from '@searchspring/snap-controller';

import type { ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type {
	AbstractController,
	SearchController,
	AutocompleteController,
	FinderController,
	RecommendationController,
	SearchControllerConfig,
	AutocompleteControllerConfig,
	FinderControllerConfig,
	RecommendationControllerConfig,
	ControllerConfigs,
	ContextVariables,
} from '@searchspring/snap-controller';
import type { Target, OnTarget } from '@searchspring/snap-toolbox';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';

import { default as createSearchController } from './create/createSearchController';
import { RecommendationInstantiator, RecommendationInstantiatorConfig } from './Instantiators/RecommendationInstantiator';
import type { SnapControllerServices, SnapControllerConfigs, RootComponent } from './types';

export const BRANCH_COOKIE = 'ssBranch';
export const DEV_COOKIE = 'ssDev';

type ExtendedTarget = Target & {
	name?: string;
	controller?: AbstractController;
	component?: () => Promise<RootComponent> | RootComponent;
	skeleton?: () => Promise<any>;
	props?: {
		[propName: string]: any;
	};
	onTarget?: OnTarget;
	prefetch?: boolean;
};

export type SnapConfig = {
	mode?: keyof typeof AppMode | AppMode;
	context?: ContextVariables;
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	instantiators?: {
		recommendation?: RecommendationInstantiatorConfig;
	};
	controllers?: {
		search?: {
			config: SearchControllerConfig;
			targeters?: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig;
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

type Controllers = SearchController | AutocompleteController | FinderController | RecommendationController;

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
		const creationFunc: (config: SnapControllerConfigs, services: SnapControllerServices) => Controllers = (await importPromise).default;

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

	constructor(config: SnapConfig, services?: SnapServices) {
		this.config = config;

		let globalContext: ContextVariables = {};
		try {
			// get global context
			globalContext = getContext(['shopper', 'config', 'merchandising']);
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

		if ((!services?.client || !services?.tracker) && !this.config?.client?.globals?.siteId) {
			throw new Error(`Snap: config provided must contain a valid config.client.globals.siteId value`);
		}

		if (this.context.merchandising?.segments) {
			if (this.config.client?.globals.merchandising) {
				this.config.client.globals.merchandising.segments = deepmerge(
					this.config.client.globals.merchandising.segments,
					this.context.merchandising.segments
				);
			} else {
				this.config.client!.globals.merchandising = {
					segments: this.context.merchandising.segments,
				};
			}
		}

		try {
			const urlParams = url(window.location.href);
			const branchOverride = urlParams?.params?.query?.branch || cookies.get(BRANCH_COOKIE);

			// devMode is set via queryParam, node env or cookie
			let devMode =
				(urlParams?.params?.query && 'dev' in urlParams.params.query) || process.env.NODE_ENV == AppMode.development || !!cookies.get(DEV_COOKIE);

			// ability to disable via ?dev=false query param
			if (urlParams?.params.query?.dev == 'false') {
				devMode = false;
			}

			// use config mode over dev mode
			if (this.config.mode && Object.values(AppMode).includes(this.config.mode as AppMode)) {
				this.mode = this.config.mode as AppMode;
			} else if (devMode) {
				this.mode = AppMode.development;

				if (featureFlags.cookies) {
					cookies.set(DEV_COOKIE, '1', 'Lax', 0);
				}
			}

			this.config.client!.config = this.config.client!.config || {};
			this.config.client!.config.mode = this.config.client!.config.mode || this.mode;
			this.client = services?.client || new Client(this.config.client!.globals, this.config.client!.config);
			this.tracker = services?.tracker || new Tracker(this.config.client!.globals);
			this.logger = services?.logger || new Logger({ prefix: 'Snap Preact ', mode: this.mode });

			// log version
			this.logger.imageText({
				url: 'https://snapui.searchspring.io/favicon.svg',
				text: `[${version}]`,
				style: `color: ${this.logger.colors.indigo}; font-weight: bold;`,
			});

			if (branchOverride && !document.querySelector(`script[${BRANCH_COOKIE}]`)) {
				this.logger.warn(`...loading build... '${branchOverride}'`);

				// set a cookie with branch
				if (featureFlags.cookies) {
					cookies.set(BRANCH_COOKIE, branchOverride, 'Lax', 3600000); // 1 hour
				} else {
					this.logger.warn('Cookies are not supported/enabled by this browser, branch overrides will not persist!');
				}

				// get the path and siteId from the current bundle script in case its not the same as the client config
				let path = `https://snapui.searchspring.io/${this.config.client!.globals.siteId}/`;
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
						const error = {
							message: 'Error',
							description: '',
						};

						let bundleDetails;

						try {
							const getBundleDetails = (await import('./getBundleDetails/getBundleDetails')).getBundleDetails;
							bundleDetails = await getBundleDetails(src);
						} catch (err) {
							error.description = err as string;
						}

						const BranchOverride = (await import('./components/BranchOverride')).BranchOverride;
						render(
							<BranchOverride
								name={branchOverride}
								details={bundleDetails}
								error={error}
								onRemoveClick={() => {
									cookies.unset(BRANCH_COOKIE);
									const urlState = url(window.location.href);
									delete urlState?.params.query['branch'];

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

						document.head.appendChild(branchScript);
						// reset the global searchspring object
						delete window.searchspring;
					}
				);

				// prevent further instantiation of config
				return;
			}
		} catch (e) {
			this.logger.error(e);
		}

		// bind to window global
		window.searchspring = window.searchspring || {};
		window.searchspring.context = this.context;
		if (this.client) window.searchspring.client = this.client;

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
									controller: { mode: this.mode, ...controller.config },
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

							let searched = false;
							const runSearch = () => {
								if (!searched) {
									searched = true;
									this.controllers[controller.config.id].search();
								}
							};

							const targetFunction = async (target: ExtendedTarget, elem: Element, originalElem: Element) => {
								runSearch();
								const onTarget = target.onTarget as OnTarget;
								onTarget && (await onTarget(target, elem, originalElem));

								try {
									const Component = await target.component!();
									setTimeout(() => {
										render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
									});
								} catch (err) {
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
									targetFunction(target, elem, originalElem!);
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

						this._controllerPromises[controller.config.id] = new Promise((resolve) => {
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
										this.logger.error(COMPONENT_ERROR, target);
									}
								};

								if (!controller?.targeters || controller?.targeters.length === 0) {
									this._createController(
										ControllerTypes.autocomplete,
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
