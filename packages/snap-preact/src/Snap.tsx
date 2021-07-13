import { h, Fragment, render } from 'preact';

import { SearchController, RecommendationController, AutocompleteController, FinderController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore, RecommendationStore, AutocompleteStore, FinderStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger, LogMode } from '@searchspring/snap-logger';
import { DomTargeter, getScriptContext } from '@searchspring/snap-toolbox';
// TODO move PACKAGE_VERSION to snap-globals (or similar)
import { Tracker, PACKAGE_VERSION } from '@searchspring/snap-tracker';

export class Snap {
	// const config = {
	//     client: {
	//         globals,
	//         config
	//     },
	//     DomTargeterControllerCreator: {
	//         recommendations: {
	//             components: {
	//                 Name: Component
	//             }
	//         }
	//     },
	//     controllers: {
	//         search: [
	//             {
	//                 config: {
	//                     id: 'search',
	//                     globals: {},
	//                     settings: {},
	//                 },
	//                 targets: [
	//                     {
	//                         selector: '#searchspring-content',
	//                         component: Content,
	//                         hideTarget: true,
	//                         inject?: {...},
	//                     }, {
	//                         selector: '#searchspring-sidebar',
	//                         component: Sidebar,
	//                         hideTarget: true,
	//                     },
	//                 ]
	//             }
	//         ],
	//         autocomplete: [
	//             {
	//                 config: {
	//                     id: 'autocomplete',
	//                     globals: {},
	//                     // selector: '',
	//                     action: '',
	//                     settings: {},
	//                 },
	//                 targets: [
	//                     {
	//                         selector: 'input[type=text].search',
	//                         component: Autocomplete,
	//                         hideTarget: true,
	//                     }
	//                 ]
	//             }
	//         ],
	//         finder: [
	//             {
	//                 config: {
	//                     id: 'finder',
	//                     globals: {},
	//                     url?: '',
	//                     fields: [{}],
	//                 },
	//                 targets: [
	//                     {
	//                         selector: 'input[type=text].search',
	//                         component: Autocomplete,
	//                         hideTarget: true,
	//                     }
	//                 ]
	//             }
	//         ],
	//         recommendation: []
	//     }
	// }
	config?: any;
	logger? = new Logger('Snap Preact');

	client: Client;
	tracker: Tracker;
	controllers: {
		[controllerConfigId: string]: SearchController | AutocompleteController | FinderController;
	};
	recommendations: {
		[controllerConfigId: string]: RecommendationController;
	};

	constructor(config) {
		this.config = config;
		if (!this.config?.client?.globals?.siteId) {
			throw new Error(`Snap: config provided must contain a valid config.client.globals.siteId value`);
		}

		this.client = new Client(this.config.client.globals, this.config?.client?.config);
		this.tracker = new Tracker(this.config.client.globals);
		this.controllers = {};

		// TODO environment switch using URL?
		this.logger.setMode(process.env.NODE_ENV as LogMode);

		// log version
		this.logger.imageText({
			url: 'https://searchspring.com/wp-content/themes/SearchSpring-Theme/dist/images/favicons/favicon.svg',
			text: `${PACKAGE_VERSION}`,
			style: `color: ${this.logger.colors.indigo}; font-weight: bold;`,
		});

		Object.keys(this.config.controllers)?.forEach((type) => {
			switch (type) {
				case 'search':
					this.config.controllers[type].forEach((controller, index) => {
						try {
							const urlManager = new UrlManager(new UrlTranslator(), reactLinker);

							const cntrlr = new SearchController(controller.config, {
								client: this.client,
								store: new SearchStore({}, { urlManager }),
								urlManager,
								eventManager: new EventManager(),
								profiler: new Profiler(),
								logger: new Logger(),
								tracker: this.tracker,
							});
							cntrlr.init();
							this.controllers[cntrlr.config.id] = cntrlr;

							controller?.targets?.forEach((target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								cntrlr.createTargeter(
									{
										selector: target.selector,
										component: target.component,
										hideTarget: target.hideTarget,
										inject: target.inject,
									},
									(target, elem) => {
										cntrlr.search();
										const Component = target.component as React.ElementType<{ controller: any }>;
										render(<Component controller={cntrlr} />, elem);
									}
								);
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});
					break;
				case 'autocomplete':
					this.config.controllers[type].forEach((controller, index) => {
						try {
							const urlManager = new UrlManager(new UrlTranslator(), reactLinker).detach();

							const cntrlr = new AutocompleteController(controller.config, {
								client: this.client,
								store: new AutocompleteStore({}, { urlManager }),
								urlManager,
								eventManager: new EventManager(),
								profiler: new Profiler(),
								logger: new Logger(),
								tracker: this.tracker,
							});
							cntrlr.init();
							this.controllers[cntrlr.config.id] = cntrlr;

							controller?.targets?.forEach((target, target_index) => {
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								cntrlr.createTargeter(
									{
										selector: cntrlr.config.selector,
										component: target.component,
										hideTarget: target.hideTarget,
										inject: target.inject || {
											action: 'after', // before, after, append, prepend
											element: (target, origElement) => {
												const acContainer = document.createElement('div');
												acContainer.className = 'ss-ac-target';
												acContainer.addEventListener('click', (e) => {
													e.stopPropagation();
												});
												return acContainer;
											},
										},
									},
									(target, injectedElem, inputElem) => {
										cntrlr.bind();
										const Component = target.component as React.ElementType<{ controller: any; input: any }>;
										render(<Component controller={cntrlr} input={controller?.config?.selector} />, injectedElem);
									}
								);
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});
					break;
				case 'finder':
					this.config.controllers[type].forEach((controller, index) => {
						try {
							const urlManager = new UrlManager(new UrlTranslator(), reactLinker).detach(true);

							const cntrlr = new FinderController(controller.config, {
								client: this.client,
								store: new FinderStore({}, { urlManager }),
								urlManager,
								eventManager: new EventManager(),
								profiler: new Profiler(),
								logger: new Logger(),
								tracker: this.tracker,
							});
							cntrlr.init();
							this.controllers[cntrlr.config.id] = cntrlr;

							controller?.targets?.forEach((target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								cntrlr.createTargeter(
									{
										selector: target.selector,
										component: target.component as any,
										hideTarget: target.hideTarget,
										inject: target.inject,
									},
									(target, elem) => {
										cntrlr.search();
										const Component = target.component as React.ElementType<{ controller: any }>;
										render(<Component controller={cntrlr} />, elem);
									}
								);
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});
					break;
				case 'recommendation':
					this.config.controllers[type].forEach((controller, index) => {
						try {
							const urlManager = new UrlManager(new UrlTranslator(), reactLinker).detach(true);

							const cntrlr = new RecommendationController(controller.config, {
								client: this.client,
								store: new RecommendationStore({}, { urlManager }),
								urlManager,
								eventManager: new EventManager(),
								profiler: new Profiler(),
								logger: new Logger(),
								tracker: this.tracker,
							});
							cntrlr.init();
							this.controllers[cntrlr.config.id] = cntrlr;

							controller?.targets?.forEach((target, target_index) => {
								if (!target.selector) {
									throw new Error(`Targets at index ${target_index} missing selector value (string).`);
								}
								if (!target.component) {
									throw new Error(`Targets at index ${target_index} missing component value (Component).`);
								}
								cntrlr.createTargeter(
									{
										selector: target.selector,
										component: target.component,
										hideTarget: target.hideTarget,
										inject: target.inject,
									},
									(target, elem) => {
										cntrlr.search();
										const Component = target.component as React.ElementType<{ controller: any }>;
										render(<Component controller={cntrlr} />, elem);
									}
								);
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});
					break;
			}
		});

		return {
			client: this.client,
			tracker: this.tracker,
			controllers: this.controllers,
			recommendations: this.recommendations,
		};
	}
}
