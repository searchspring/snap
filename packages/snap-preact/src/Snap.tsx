import { h, Fragment, render } from 'preact';

import { SearchController, RecommendationController, AutocompleteController, FinderController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore, RecommendationStore, AutocompleteStore, FinderStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger, LogMode } from '@searchspring/snap-logger';
import { DomTargeter, getScriptContext } from '@searchspring/snap-toolbox';
import { Tracker } from '@searchspring/snap-tracker';

const profileCount = {};
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

		Object.keys(this.config.controllers)?.forEach((type) => {
			// ['search', 'autocomplete']
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
										render(<target.component controller={cntrlr} />, elem);
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
							const urlManager = new UrlManager(new UrlTranslator(), reactLinker).detach(true);

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
												acContainer.id = 'ss-ac-target';
												acContainer.addEventListener('click', (e) => {
													e.stopPropagation();
												});
												return acContainer;
											},
										},
									},
									(target, injectedElem, inputElem) => {
										cntrlr.bind();
										const acComponent = <target.component store={cntrlr.store} controller={cntrlr} input={inputElem} />;
										render(acComponent, injectedElem);
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
										component: target.component,
										hideTarget: target.hideTarget,
										inject: target.inject,
									},
									(target, elem) => {
										cntrlr.search();
										render(<target.component controller={cntrlr} />, elem);
									}
								);
							});
						} catch (err) {
							this.logger.error(`Failed to instantiate ${type} controller at index ${index}.`, err);
						}
					});
					break;
				case 'recommendation':
					new DomTargeter(
						[
							{
								selector: 'script[type="searchspring/recommend"]',
								inject: {
									action: 'before',
									element: (target, origElement) => {
										const profile = origElement.getAttribute('profile');
										if (profile) {
											const recsContainer = document.createElement('div');
											recsContainer.setAttribute('searchspring-recommend', profile);
											return recsContainer;
										}
									},
								},
							},
						],
						async (target, injectedElem, elem) => {
							const globals = {};

							const { shopper, shopperId, product, seed, branch, options } = getScriptContext(elem, [
								'shopperId',
								'shopper',
								'product',
								'seed',
								'branch',
								'options',
							]);

							if (shopper || shopperId) {
								globals.shopper = shopper || shopperId;
							}
							if (product || seed) {
								globals.product = product || seed;
							}
							if (branch) {
								globals.branch = branch;
							}
							if (options && options.siteId) {
								globals.siteId = options.siteId;
							}
							if (options && options.categories) {
								globals.categories = options.categories;
							}

							const tag = injectedElem.getAttribute('searchspring-recommend');
							profileCount[tag] = profileCount[tag] + 1 || 1;

							const recsUrlManager = new UrlManager(new UrlTranslator(), reactLinker).detach();

							const cntrlr = new RecommendationController(
								{
									id: `recommend_${tag + (profileCount[tag] - 1)}`,
									tag,
									branch: BRANCHNAME,
									globals,
								},
								{
									client: this.client,
									// store: new RecommendationStore({}, { urlManager: recsUrlManager, tracker: this.tracker }),
									store: new RecommendationStore({}, { urlManager: recsUrlManager }),
									urlManager: new UrlManager(new UrlTranslator(), reactLinker),
									eventManager: new EventManager(),
									profiler: new Profiler(),
									logger: new Logger(),
									tracker: this.tracker,
								}
							);
							await cntrlr.init();
							await cntrlr.search();
							const profileVars = cntrlr.store.profile.display.templateParameters;

							if (!profileVars) {
								cntrlr.log.error(`profile failed to load!`);
								return;
							}

							if (!profileVars.component) {
								cntrlr.log.error(`template does not support components!`);
							}

							const RecommendationsComponent = config.DomTargeterControllerCreator.recommendations.components[profileVars.component];
							if (!RecommendationsComponent) {
								cntrlr.log.error(`component '${profileVars.component}' not found!`);
							}

							render(<RecommendationsComponent controller={cntrlr} />, injectedElem);
						}
					);

					// this.config.controllers[type].forEach((controller, index) => {
					//     const cntrlr = new RecommendationController(controller.config, {
					//         client: this.client,
					//         // store: new RecommendationStore({}, { urlManager: this.urlManager, tracker: this.tracker }),
					//         store: new RecommendationStore({}, { urlManager: this.urlManager }),
					//         urlManager: this.urlManager,
					//         eventManager: new EventManager(),
					//         profiler: new Profiler(),
					//         logger: new Logger(),
					//         tracker: this.tracker,
					//     })
					//     this.controllers[controller.config.id || `${type}${index}`] = cntrlr;

					//     controller?.targets?.forEach(target => {
					//         new DomTargeter(
					//             [
					//                 {
					//                     selector: target.selector,
					//                     component: <target.component controller={cntrlr}/>,
					//                 },
					//             ],
					//             async (target, elem) => {
					//                 await cntrlr.search();
					//                 render(target, elem);
					//             }
					//         );
					//     })
					// });
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
