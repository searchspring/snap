import deepmerge from 'deepmerge';
import { h, render } from 'preact';

import { Client } from '@searchspring/snap-client';
import { Logger, LogMode } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { version, DomTargeter } from '@searchspring/snap-toolbox';

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
} from '@searchspring/snap-controller';
import type { Target, OnTarget } from '@searchspring/snap-toolbox';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';

import { RecommendationInstantiator, RecommendationInstantiatorConfig } from './Instantiators/RecommendationInstantiator';
import type { SnapControllerServices, RootComponent } from './types';

type ExtendedTarget = Target & {
	name?: string;
	controller?: AbstractController;
	component?: () => Promise<RootComponent> | RootComponent;
	props?: unknown;
	onTarget?: OnTarget;
	prefetch?: boolean;
};

export type SnapConfig = {
	url?: UrlTranslatorConfig;
	client: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	instantiators?: {
		recommendation?: RecommendationInstantiatorConfig;
	};
	controllers?: {
		search?: {
			config: SearchControllerConfig;
			targets?: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig;
		}[];
		autocomplete?: {
			config: AutocompleteControllerConfig;
			targets: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig;
		}[];
		finder?: {
			config: FinderControllerConfig;
			targets?: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig;
		}[];
		recommendation?: {
			config: RecommendationControllerConfig;
			targets?: ExtendedTarget[];
			services?: SnapControllerServices;
			url?: UrlTranslatorConfig;
		}[];
	};
};

type ControllerTypes = SearchController | AutocompleteController | FinderController | RecommendationController;
export class Snap {
	config: SnapConfig;
	logger: Logger;
	client: Client;
	tracker: Tracker;
	controllers: {
		[controllerConfigId: string]: ControllerTypes;
	};
	recommendations: RecommendationInstantiator;
	promises: any;

	public getController = (id: string): Promise<ControllerTypes> => {
		return this.promises[id];
		// return new Promise((resolve, reject) => {
		//     let count = 0;
		//     const MAX_TIMEOUT = 500;
		//     const DELAY = 4; // 4ms is browser minimum
		//     const interval = setInterval(() => {
		//         if(this.controllers[id]) {
		//             clearInterval(interval)
		//             resolve(this.controllers[id])
		//         } else if(count > MAX_TIMEOUT / DELAY) {
		//             clearInterval(interval)
		//             reject(`getController could not find a controller with id: '${id}'`)
		//         }
		//         count = count + 1;
		//     })
		// })
	};

	constructor(config: SnapConfig) {
		this.config = config;
		if (!this.config?.client?.globals?.siteId) {
			throw new Error(`Snap: config provided must contain a valid config.client.globals.siteId value`);
		}

		this.client = new Client(this.config.client.globals, this.config.client.config);
		this.tracker = new Tracker(this.config.client.globals);
		this.logger = new Logger('Snap Preact ');
		this.controllers = {};
		this.promises = {};

		// TODO environment switch using URL?
		this.logger.setMode(process.env.NODE_ENV as LogMode);

		// log version
		this.logger.imageText({
			url: 'https://searchspring.com/wp-content/themes/SearchSpring-Theme/dist/images/favicons/favicon.svg',
			text: `[${version}]`,
			style: `color: ${this.logger.colors.indigo}; font-weight: bold;`,
		});

		Object.keys(this.config?.controllers || {}).forEach((type) => {
			switch (type) {
				case 'search': {
					this.config.controllers[type].forEach((controller, index) => {
						try {
							this.promises[controller.config.id] = new Promise((resolve, reject) => {
								let searched = false;
								const runSearch = () => {
									if (!searched) {
										searched = true;
										setTimeout(() => {
											this.controllers[controller.config.id].search();
										});
									}
								};
								const targetFunction = async (target, elem, originalElem) => {
									const onTarget = target.onTarget as OnTarget;
									onTarget && onTarget(target, elem, originalElem);

									const Component = await (target as ExtendedTarget).component();

									setTimeout(() => {
										render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
									});
								};
								if (!controller?.targets || controller?.targets.length === 0) {
									import('./create/searchController').then(({ createSearchController }) => {
										this.controllers[controller.config.id] =
											this.controllers[controller.config.id] ||
											createSearchController(
												{
													url: deepmerge(config.url || {}, controller.url || {}),
													controller: controller.config,
												},
												{ client: controller.services?.client || this.client, tracker: controller.services?.tracker || this.tracker }
											);
										resolve(this.controllers[controller.config.id]);
									});
								}

								controller?.targets?.forEach(async (target, target_index) => {
									if (!target.selector) {
										throw new Error(`Targets at index ${target_index} missing selector value (string).`);
									}
									if (!target.component) {
										throw new Error(`Targets at index ${target_index} missing component value (Component).`);
									}
									if (target.prefetch) {
										import('./create/searchController').then(({ createSearchController }) => {
											this.controllers[controller.config.id] =
												this.controllers[controller.config.id] ||
												createSearchController(
													{
														url: deepmerge(config.url || {}, controller.url || {}),
														controller: controller.config,
													},
													{ client: controller.services?.client || this.client, tracker: controller.services?.tracker || this.tracker }
												);

											// promise resolve AND be sure middleware attached in index.js is executed BEFORE searching
											console.log('before resolving...');
											resolve(this.controllers[controller.config.id]);
											console.log('after resolving...');
											runSearch();

											this.controllers[controller.config.id].createTargeter({ ...target }, targetFunction);
										});
									} else {
										new DomTargeter([{ ...target }], async (target, elem, originalElem) => {
											const createSearchController = (await import('./create/searchController')).createSearchController;
											this.controllers[controller.config.id] =
												this.controllers[controller.config.id] ||
												createSearchController(
													{
														url: deepmerge(config.url || {}, controller.url || {}),
														controller: controller.config,
													},
													{ client: controller.services?.client || this.client, tracker: controller.services?.tracker || this.tracker }
												);
											resolve(this.controllers[controller.config.id]);
											runSearch();

											targetFunction(target, elem, originalElem);
										});
									}
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
						try {
							const targetFunction = async (target, elem, originalElem) => {
								const onTarget = target.onTarget as OnTarget;
								onTarget && onTarget(target, elem, originalElem);

								const Component = (await (target as ExtendedTarget).component()) as React.ElementType<{
									controller: AutocompleteController;
									input: HTMLInputElement | string | Element;
								}>;

								setTimeout(() => {
									render(<Component controller={this.controllers[controller.config.id]} input={originalElem} {...target.props} />, elem);
								});
							};

							controller?.targets?.forEach(async (target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								new DomTargeter(
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
										const createAutocompleteController = (await import('./create/autocompleteController')).createAutocompleteController;
										this.controllers[controller.config.id] =
											this.controllers[controller.config.id] ||
											createAutocompleteController(
												{
													url: deepmerge(config.url || {}, controller.url || {}),
													controller: controller.config,
												},
												{ client: controller.services?.client || this.client, tracker: controller.services?.tracker || this.tracker }
											);

										(this.controllers[controller.config.id] as AutocompleteController).bind();

										targetFunction(target, elem, originalElem);
									}
								);
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});

					break;
				}

				case 'finder': {
					this.config.controllers[type].forEach((controller, index) => {
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
								onTarget && onTarget(target, elem, originalElem);

								const Component = await (target as ExtendedTarget).component();

								setTimeout(() => {
									render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
								});
							};

							controller?.targets?.forEach(async (target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								new DomTargeter([{ ...target }], async (target, elem, originalElem) => {
									const createFinderController = (await import('./create/finderController')).createFinderController;
									this.controllers[controller.config.id] =
										this.controllers[controller.config.id] ||
										createFinderController(
											{
												url: deepmerge(config.url || {}, controller.url || {}),
												controller: controller.config,
											},
											{ client: controller.services?.client || this.client, tracker: controller.services?.tracker || this.tracker }
										);
									runSearch();

									targetFunction(target, elem, originalElem);
								});
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});

					break;
				}

				case 'recommendation': {
					this.config.controllers[type].forEach((controller, index) => {
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
								onTarget && onTarget(target, elem, originalElem);

								const Component = await (target as ExtendedTarget).component();

								setTimeout(() => {
									render(<Component controller={this.controllers[controller.config.id]} {...target.props} />, elem);
								});
							};

							controller?.targets?.forEach(async (target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								new DomTargeter([{ ...target }], async (target, elem, originalElem) => {
									const createRecommendationController = (await import('./create/recommendationController')).createRecommendationController;
									this.controllers[controller.config.id] =
										this.controllers[controller.config.id] ||
										createRecommendationController(
											{
												url: deepmerge(config.url || {}, controller.url || {}),
												controller: controller.config,
											},
											{ client: controller.services?.client || this.client, tracker: controller.services?.tracker || this.tracker }
										);
									runSearch();

									targetFunction(target, elem, originalElem);
								});
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});

					break;
				}
			}
		});

		if (config?.instantiators?.recommendation) {
			try {
				import('./Instantiators/RecommendationInstantiator').then(({ RecommendationInstantiator }) => {
					this.recommendations = new RecommendationInstantiator(config.instantiators.recommendation, {
						client: this.client,
						tracker: this.tracker,
						logger: this.logger,
					});
				});
			} catch (err) {
				this.logger.error(`Failed to create Recommendations Instantiator.`, err);
			}
		}
	}
}
