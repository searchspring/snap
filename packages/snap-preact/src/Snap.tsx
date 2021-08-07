import { h, render } from 'preact';

import {
	SearchController,
	RecommendationController,
	AutocompleteController,
	FinderController,
	AbstractController,
} from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore, RecommendationStore, AutocompleteStore, FinderStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger, LogMode } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { version } from '@searchspring/snap-toolbox';

import type {
	SearchControllerConfig,
	AutocompleteControllerConfig,
	FinderControllerConfig,
	RecommendationControllerConfig,
} from '@searchspring/snap-controller';
import type { ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type { Target, OnTarget } from '@searchspring/snap-toolbox';

import { RecommendationInstantiator, RecommendationInstantiatorConfig } from './Instantiators/RecommendationInstantiator';
import type { SnapControllerServices } from './types';

type ExtendedTarget = Target & {
	name?: string;
	controller?: AbstractController;
	component?: React.Component;
	props?: unknown;
	onTarget?: OnTarget;
};

export type SnapConfig = {
	parameters?: {
		[paramName: string]: {
			name: string;
			type?: string;
		};
	};
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
		}[];
		autocomplete?: {
			config: AutocompleteControllerConfig;
			targets: ExtendedTarget[];
			services?: SnapControllerServices;
		}[];
		finder?: {
			config: FinderControllerConfig;
			targets?: ExtendedTarget[];
			services?: SnapControllerServices;
		}[];
		recommendation?: {
			config: RecommendationControllerConfig;
			targets?: ExtendedTarget[];
			services?: SnapControllerServices;
		}[];
	};
};

type ControllerConfigs = SearchControllerConfig | AutocompleteControllerConfig | FinderControllerConfig | RecommendationControllerConfig;
export class Snap {
	config: SnapConfig;
	logger: Logger;
	client: Client;
	tracker: Tracker;
	controllers: {
		[controllerConfigId: string]: SearchController | AutocompleteController | FinderController | RecommendationController;
	};
	recommendations: RecommendationInstantiator;

	constructor(config: SnapConfig) {
		this.config = config;
		if (!this.config?.client?.globals?.siteId) {
			throw new Error(`Snap: config provided must contain a valid config.client.globals.siteId value`);
		}

		this.client = new Client(this.config.client.globals, this.config.client.config);
		this.tracker = new Tracker(this.config.client.globals);
		this.logger = new Logger('Snap Preact ');
		this.controllers = {};

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
							const cntrlr = this.createController(type, controller.config, controller.services) as SearchController;

							let searched = false;
							const runSearch = () => {
								if (!searched) {
									cntrlr.search();
									searched = true;
								}
							};

							controller?.targets?.forEach((target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}

								cntrlr.createTargeter(
									{
										controller: cntrlr,
										...target,
									},
									(target, elem, originalElem) => {
										const onTarget = target.onTarget as OnTarget;
										onTarget && onTarget(target, elem, originalElem);

										runSearch();

										const Component = target.component as React.ElementType<{ controller: any }>;
										render(<Component controller={cntrlr} {...target.props} />, elem);
									}
								);
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
							const cntrlr = this.createController(type, controller.config, controller.services) as AutocompleteController;

							controller?.targets?.forEach((target, target_index) => {
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}

								cntrlr.createTargeter(
									{
										controller: cntrlr,
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
									(target, elem, originalElem) => {
										const onTarget = target.onTarget as OnTarget;
										onTarget && onTarget(target, elem, originalElem);

										cntrlr.bind();

										const Component = target.component as React.ElementType<{ controller: any; input: any }>;
										render(<Component controller={cntrlr} input={originalElem} {...target.props} />, elem);
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
							const cntrlr = this.createController(type, controller.config, controller.services) as FinderController;

							let searched = false;
							const runSearch = () => {
								if (!searched) {
									cntrlr.search();
									searched = true;
								}
							};

							controller?.targets?.forEach((target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								cntrlr.createTargeter(
									{
										controller: cntrlr,
										...target,
									},
									(target, elem, originalElem) => {
										const onTarget = target.onTarget as OnTarget;
										onTarget && onTarget(target, elem, originalElem);

										runSearch();

										const Component = target.component as React.ElementType<{ controller: any }>;
										render(<Component controller={cntrlr} {...target.props} />, elem);
									}
								);
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
							const cntrlr = this.createController(type, controller.config, controller.services) as RecommendationController;

							let searched = false;
							const runSearch = () => {
								if (!searched) {
									cntrlr.search();
									searched = true;
								}
							};

							controller?.targets?.forEach((target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								cntrlr.createTargeter(
									{
										controller: cntrlr,
										...target,
									},
									(target, elem, originalElem) => {
										const onTarget = target.onTarget as OnTarget;
										onTarget && onTarget(target, elem, originalElem);

										runSearch();

										const Component = target.component as React.ElementType<{ controller: any }>;
										render(<Component controller={cntrlr} {...target.props} />, elem);
									}
								);
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});

					break;
				}
			}
		});

		if (this.config?.instantiators?.recommendation) {
			try {
				this.recommendations = new RecommendationInstantiator(config.instantiators.recommendation, {
					client: this.client,
					tracker: this.tracker,
					logger: this.logger,
				});
			} catch (err) {
				this.logger.error(`Failed to create Recommendations Instantiator.`, err);
			}
		}
	}

	public createController(type: string, config: ControllerConfigs, services?: SnapControllerServices): AbstractController {
		let translatorConfig;
		if (this.config.parameters?.search?.name) {
			translatorConfig = {
				queryParameter: this.config.parameters?.search?.name,
			};
		}

		switch (type) {
			case 'search': {
				const urlManager = services?.urlManager || new UrlManager(new UrlTranslator(translatorConfig), reactLinker);
				const cntrlr = new SearchController(config as SearchControllerConfig, {
					client: services?.client || this.client,
					store: services?.store || new SearchStore(config, { urlManager }),
					urlManager,
					eventManager: services?.eventManager || new EventManager(),
					profiler: services?.profiler || new Profiler(),
					logger: services?.logger || new Logger(),
					tracker: services?.tracker || this.tracker,
				});

				this.controllers[cntrlr.config.id] = cntrlr;
				return cntrlr;
			}

			case 'autocomplete': {
				const urlManager = services?.urlManager || new UrlManager(new UrlTranslator(translatorConfig), reactLinker).detach();
				const cntrlr = new AutocompleteController(config as AutocompleteControllerConfig, {
					client: services?.client || this.client,
					store: services?.store || new AutocompleteStore(config, { urlManager }),
					urlManager,
					eventManager: services?.eventManager || new EventManager(),
					profiler: services?.profiler || new Profiler(),
					logger: services?.logger || new Logger(),
					tracker: services?.tracker || this.tracker,
				});

				this.controllers[cntrlr.config.id] = cntrlr;
				return cntrlr;
			}

			case 'finder': {
				const urlManager = services?.urlManager || new UrlManager(new UrlTranslator(translatorConfig), reactLinker).detach(true);
				const cntrlr = new FinderController(config as FinderControllerConfig, {
					client: services?.client || this.client,
					store: services?.store || new FinderStore(config, { urlManager }),
					urlManager,
					eventManager: services?.eventManager || new EventManager(),
					profiler: services?.profiler || new Profiler(),
					logger: services?.logger || new Logger(),
					tracker: services?.tracker || this.tracker,
				});

				this.controllers[cntrlr.config.id] = cntrlr;
				return cntrlr;
			}

			case 'recommendation': {
				const urlManager = services?.urlManager || new UrlManager(new UrlTranslator(translatorConfig), reactLinker).detach(true);
				const cntrlr = new RecommendationController(config as RecommendationControllerConfig, {
					client: services?.client || this.client,
					store: services?.store || new RecommendationStore(config, { urlManager }),
					urlManager,
					eventManager: services?.eventManager || new EventManager(),
					profiler: services?.profiler || new Profiler(),
					logger: services?.logger || new Logger(),
					tracker: services?.tracker || this.tracker,
				});

				this.controllers[cntrlr.config.id] = cntrlr;
				return cntrlr;
			}
		}
	}
}
