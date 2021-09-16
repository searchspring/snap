import { render } from 'preact';

import { DomTargeter, getScriptContext } from '@searchspring/snap-toolbox';
import { RecommendationController } from '@searchspring/snap-controller';
import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager, Middleware } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

import type { Client } from '@searchspring/snap-client';
import type { Tracker } from '@searchspring/snap-tracker';
import type { AbstractController, Attachments } from '@searchspring/snap-controller';

import type { SnapControllerServices } from '../types';

export type RecommendationInstantiatorConfig = {
	components: {
		[name: string]: React.ElementType<{ controller: RecommendationController }>;
	};
	importedComponents: {
		[name: string]: () => Promise<any>;
	};
	config: {
		branch: string;
	};
	selector?: string;
	services?: SnapControllerServices;
};

type InstantiatorServices = {
	client: Client;
	logger: Logger;
	tracker: Tracker;
};

export class RecommendationInstantiator {
	controllers: {
		[key: string]: AbstractController;
	} = {};
	client: Client;
	tracker: Tracker;
	logger: Logger;
	config: RecommendationInstantiatorConfig;
	uses: Attachments[] = [];
	plugins: { (cntrlr: AbstractController): Promise<void> }[] = [];
	middleware: { event: string; func: Middleware<unknown>[] }[] = [];
	public targets: {
		[key: string]: DomTargeter;
	} = {};

	constructor(config: RecommendationInstantiatorConfig, { client, logger, tracker }: InstantiatorServices) {
		this.client = client;
		this.tracker = tracker;
		this.config = config;
		this.logger = logger;

		if (!this.config) {
			throw new Error(`Recommendation Instantiator config is required`);
		}

		if (!this.config.config?.branch) {
			throw new Error(`Recommendation Instantiator config must contain 'branch' property`);
		}

		// if (!this.config.components || typeof this.config.components != 'object') {
		// 	throw new Error(`Recommendation Instantiator config must contain 'components' mapping property`);
		// }

		const profileCount = {};

		new DomTargeter(
			[
				{
					selector: `script[type="searchspring/recommend"]${this.config.selector ? ` , ${this.config.selector}` : ''}`,
					inject: {
						action: 'before',
						element: (target, origElement) => {
							const profile = origElement.getAttribute('profile');

							if (profile) {
								const recsContainer = document.createElement('div');
								recsContainer.setAttribute('searchspring-recommend', profile);
								return recsContainer;
							} else {
								this.logger.warn(`'profile' attribute is missing from <script> tag, skipping this profile`, origElement);
							}
						},
					},
				},
			],
			async (target, injectedElem, elem) => {
				const globals: any = {};

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

				const urlManager = this.config.services?.urlManager || new UrlManager(new UrlTranslator(), reactLinker).detach();
				const controllerConfig = {
					id: `recommend_${tag + (profileCount[tag] - 1)}`,
					tag,
					globals,
					...this.config.config,
				};
				const recs = new RecommendationController(controllerConfig, {
					client: this.config.services?.client || this.client,
					store: this.config.services?.store || new RecommendationStore(controllerConfig, { urlManager }),
					urlManager,
					eventManager: this.config.services?.eventManager || new EventManager(),
					profiler: this.config.services?.profiler || new Profiler(),
					logger: this.config.services?.logger || new Logger(),
					tracker: this.config.services?.tracker || this.tracker,
				});

				this.uses.forEach((attachements) => recs.use(attachements));
				this.plugins.forEach((plugin) => recs.plugin(plugin));
				this.middleware.forEach((middleware) => recs.on(middleware.event, ...middleware.func));

				await recs.search();

				this.controllers[recs.config.id] = recs;

				const profileVars = recs.store.profile.display.templateParameters;

				if (!profileVars) {
					recs.log.error(`profile failed to load!`);
					return;
				}

				if (!profileVars.component) {
					recs.log.error(`template does not support components!`);
				}

				let RecommendationsComponent = this.config.components && this.config.components[profileVars.component];

				if (!RecommendationsComponent && this.config.importedComponents && this.config.importedComponents[profileVars.component]) {
					RecommendationsComponent = await this.config.importedComponents[profileVars.component]();
				}

				// console.log("typeof", typeof RecommendationsComponent)
				// console.log("RecommendationsComponent", {...RecommendationsComponent})
				// if (typeof RecommendationsComponent) {
				// 	const componentImport = await (target as ExtendedTarget).importedComponent();
				// 	RecommendationsComponent = componentImport;
				// }

				if (!RecommendationsComponent) {
					recs.log.error(`component '${profileVars.component}' not found!`);
				}

				setTimeout(() => {
					render(<RecommendationsComponent controller={recs} />, injectedElem);
				});
			}
		);
	}

	public plugin(func: (cntrlr: AbstractController) => Promise<void>): void {
		this.plugins.push(func);
	}

	public on<T>(event: string, ...func: Middleware<T>[]): void {
		this.middleware.push({ event, func });
	}

	public use(attachments: Attachments): void {
		this.uses.push(attachments);
	}
}
