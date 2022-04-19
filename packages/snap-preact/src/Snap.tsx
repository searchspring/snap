import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import { h, render } from 'preact';
import { Client } from '@searchspring/snap-client';
import { Logger, LogMode } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { version, DomTargeter, url, cookies, featureFlags } from '@searchspring/snap-toolbox';
import { getContext } from '@searchspring/snap-toolbox';
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
import type { Product } from '@searchspring/snap-tracker';
import type { Target, OnTarget } from '@searchspring/snap-toolbox';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';

import { default as createSearchController } from './create/createSearchController';
import { RecommendationInstantiator, RecommendationInstantiatorConfig } from './Instantiators/RecommendationInstantiator';
import { getBundleDetails } from './getBundleDetails/getBundleDetails';
import type { SnapControllerServices, SnapControllerConfigs, RootComponent } from './types';

export const BRANCH_COOKIE = 'ssBranch';
export const SS_DEV_COOKIE = 'ssDev';

type ExtendedTarget = Target & {
	name?: string;
	controller?: AbstractController;
	component?: () => Promise<RootComponent> | RootComponent;
	skeleton?: () => Promise<any>;
	props?: unknown;
	onTarget?: OnTarget;
	prefetch?: boolean;
};

export type SnapConfig = {
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
	config: SnapConfig;
	logger: Logger;
	client: Client;
	tracker: Tracker;
	context: ContextVariables;
	_controllerPromises: {
		[controllerConfigId: string]: Promise<Controllers>;
	};

	controllers: {
		[controllerConfigId: string]: Controllers;
	};

	_instantiatorPromises: {
		[instantiatorId: string]: Promise<RecommendationInstantiator>;
	};

	public getInstantiator = (id: string): Promise<RecommendationInstantiator> => {
		return this._instantiatorPromises[id] || Promise.reject(`getInstantiator could not find instantiator with id: ${id}`);
	};

	public getController = (id: string): Promise<Controllers> => {
		return this._controllerPromises[id] || Promise.reject(`getController could not find controller with id: ${id}`);
	};

	public getControllers = (...controllerIds: string[]): Promise<Controllers[]> => {
		const getControllerPromises = [];
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
		let importPromise;
		switch (type) {
			case ControllerTypes.search:
				importPromise = import('./create/createSearchController');
				break;
			case ControllerTypes.autocomplete:
				importPromise = import('./create/createAutocompleteController');
				break;
			case ControllerTypes.finder:
				importPromise = import('./create/createFinderController');
				break;
			case ControllerTypes.recommendation:
				importPromise = import('./create/createRecommendationController');
				break;
		}

		if (!this.controllers[config.id]) {
			const creationFunc: (config: SnapControllerConfigs, services: SnapControllerServices) => Controllers = (await importPromise).default;

			this.controllers[config.id] = creationFunc(
				{
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

		this.logger = services?.logger || new Logger('Snap Preact ');

		let globalContext: ContextVariables = {};
		try {
			// get global context
			globalContext = getContext(['shopper', 'config']);
		} catch (err) {
			this.logger.error('failed to find global context');
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

		this.client = services?.client || new Client(this.config.client.globals, this.config.client.config);
		this.tracker = services?.tracker || new Tracker(this.config.client.globals);
		this._controllerPromises = {};
		this._instantiatorPromises = {};
		this.controllers = {};

		// TODO environment switch using URL?
		this.logger.setMode(process.env.NODE_ENV as LogMode);

		// log version
		this.logger.imageText({
			url: 'https://snapui.searchspring.io/favicon.svg',
			text: `[${version}]`,
			style: `color: ${this.logger.colors.indigo}; font-weight: bold;`,
		});

		try {
			const urlParams = url(window.location.href);
			const branchParam = urlParams.params?.query?.branch || cookies.get(BRANCH_COOKIE);

			if (branchParam && !document.querySelector(`script[${BRANCH_COOKIE}]`)) {
				// set a cookie or localstorage with branch
				if (featureFlags.cookies) {
					cookies.set(BRANCH_COOKIE, branchParam, 'Lax', 3600000); // 1 hour
					cookies.set(SS_DEV_COOKIE, '1', 'Lax', 0);
				} else {
					this.logger.warn('Cookies are not supported/enabled by this browser, branch overrides will not persist!');
				}

				this.logger.setMode(LogMode.DEVELOPMENT);
				this.logger.warn(`...loading build... '${branchParam}'`);

				// get the path and siteId from the current bundle script in case its not the same as the client config
				let path = `https://snapui.searchspring.io/${this.config.client.globals.siteId}/`;
				const script = document.querySelector('script[src*="//snapui.searchspring.io"]');

				if (script) {
					const scriptRoot = script.getAttribute('src').match(/\/\/snapui.searchspring.io\/[a-zA-Z0-9]{6}\//);
					if (scriptRoot) {
						path = scriptRoot.toString();
					}
				}

				// append script with new branch in path
				const branchScript = document.createElement('script');
				const src = `${path}${branchParam}/bundle.js`;
				branchScript.src = src;
				branchScript.setAttribute(BRANCH_COOKIE, branchParam);
				document.head.appendChild(branchScript);

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
					async (target, elem) => {
						let bundleDetails, error;
						try {
							bundleDetails = await getBundleDetails(src);
						} catch (err) {
							error = err;
						}

						const BranchOverride = (await import('./components/BranchOverride')).BranchOverride;
						render(
							<BranchOverride
								name={branchParam}
								details={bundleDetails}
								error={error}
								onRemoveClick={() => {
									cookies.unset(BRANCH_COOKIE);
									const urlState = url(window.location.href);
									delete urlState.params.query['branch'];
									window.location.href = urlState.url();
								}}
							/>,
							elem
						);
					}
				);

				// prevent further instantiation of config
				return;
			}
		} catch (e) {}

		if (window.searchspring) {
			window.searchspring.context = this.context;
			if (this.client) window.searchspring.client = this.client;
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
				const cartItems = cart.filter((item) => item?.sku || item?.childSku).map((item) => (item?.sku || item?.childSku).trim());
				this.tracker.cookies.cart.set(cartItems);
			}
		}

		Object.keys(this.config?.controllers || {}).forEach((type) => {
			switch (type) {
				case 'search': {
					this.config.controllers[type].forEach((controller, index) => {
						try {
							const cntrlr = createSearchController(
								{
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

							this.controllers[cntrlr.config.id] = cntrlr;
							this._controllerPromises[cntrlr.config.id] = new Promise((resolve) => resolve(cntrlr));

							let searched = false;
							const runSearch = () => {
								if (!searched) {
									searched = true;
									this.controllers[controller.config.id].search();
								}
							};

							const targetFunction = async (target, elem, originalElem) => {
								runSearch();
								const onTarget = target.onTarget as OnTarget;
								onTarget && (await onTarget(target, elem, originalElem));

								try {
									const Component = await (target as ExtendedTarget).component();
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

								cntrlr.createTargeter({ controller: cntrlr, ...target }, async (target, elem, originalElem) => {
									if (target.skeleton) {
										const Skeleton = await (target as ExtendedTarget).skeleton();
										setTimeout(() => {
											render(<Skeleton />, elem);
										});
									}
									targetFunction(target, elem, originalElem);
								});
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});
					break;
				}

				case 'autocomplete': {
					this.config.controllers[type].forEach((controller, index) => {
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

								const targetFunction = async (target, elem, originalElem) => {
									const onTarget = target.onTarget as OnTarget;
									onTarget && (await onTarget(target, elem, originalElem));

									try {
										const Component = (await (target as ExtendedTarget).component()) as React.ElementType<{
											controller: AutocompleteController;
											input: HTMLInputElement | string | Element;
										}>;

										setTimeout(() => {
											render(<Component controller={this.controllers[controller.config.id]} input={originalElem} {...target.props} />, elem);
										});
									} catch (err) {
										this.logger.error(COMPONENT_ERROR, target);
									}
								};

								if (!controller?.targeters || controller?.targeters.length === 0) {
									this.createController(
										ControllerTypes.autocomplete,
										controller.config,
										controller.services,
										controller.url,
										controller.context,
										(cntrlr) => {
											resolve(cntrlr);
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
										async (target, elem, originalElem) => {
											const cntrlr = await this.createController(
												ControllerTypes.autocomplete,
												controller.config,
												controller.services,
												controller.url,
												controller.context,
												(cntrlr) => {
													resolve(cntrlr);
												}
											);
											runBind();
											targetFunction({ controller: cntrlr, ...target }, elem, originalElem);
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
					this.config.controllers[type].forEach((controller, index) => {
						this._controllerPromises[controller.config.id] = new Promise((resolve) => {
							try {
								let searched = false;
								const runSearch = () => {
									if (!searched) {
										this.controllers[controller.config.id].search();
										searched = true;
									}
								};
								const targetFunction = async (target, elem, originalElem) => {
									const onTarget = target.onTarget as OnTarget;
									onTarget && (await onTarget(target, elem, originalElem));

									try {
										const Component = await (target as ExtendedTarget).component();

										setTimeout(() => {
											render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
										});
									} catch (err) {
										this.logger.error(COMPONENT_ERROR, target);
									}
								};

								if (!controller?.targeters || controller?.targeters.length === 0) {
									this.createController(
										ControllerTypes.finder,
										controller.config,
										controller.services,
										controller.url,
										controller.context,
										(cntrlr) => {
											resolve(cntrlr);
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
									const targeter = new DomTargeter([{ ...target }], async (target, elem, originalElem) => {
										const cntrlr = await this.createController(
											ControllerTypes.finder,
											controller.config,
											controller.services,
											controller.url,
											controller.context,
											(cntrlr) => {
												resolve(cntrlr);
											}
										);
										runSearch();
										targetFunction({ controller: cntrlr, ...target }, elem, originalElem);
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
					this.config.controllers[type].forEach((controller, index) => {
						this._controllerPromises[controller.config.id] = new Promise((resolve) => {
							try {
								let searched = false;
								const runSearch = () => {
									if (!searched) {
										this.controllers[controller.config.id].search();
										searched = true;
									}
								};
								const targetFunction = async (target, elem, originalElem) => {
									const onTarget = target.onTarget as OnTarget;
									onTarget && (await onTarget(target, elem, originalElem));

									try {
										const Component = await (target as ExtendedTarget).component();

										setTimeout(() => {
											render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
										});
									} catch (err) {
										this.logger.error(COMPONENT_ERROR, target);
									}
								};

								if (!controller?.targeters || controller?.targeters.length === 0) {
									this.createController(
										ControllerTypes.recommendation,
										controller.config,
										controller.services,
										controller.url,
										controller.context,
										(cntrlr) => {
											resolve(cntrlr);
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
									const targeter = new DomTargeter([{ ...target }], async (target, elem, originalElem) => {
										const cntrlr = await this.createController(
											ControllerTypes.recommendation,
											controller.config,
											controller.services,
											controller.url,
											controller.context,
											(cntrlr) => {
												resolve(cntrlr);
											}
										);
										runSearch();
										targetFunction({ controller: cntrlr, ...target }, elem, originalElem);
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
				this._instantiatorPromises.recommendations = import('./Instantiators/RecommendationInstantiator').then(({ RecommendationInstantiator }) => {
					return new RecommendationInstantiator(
						this.config.instantiators.recommendation,
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
