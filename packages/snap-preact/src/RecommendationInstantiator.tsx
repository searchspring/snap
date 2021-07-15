import { render } from 'preact';

import type { Client } from '@searchspring/snap-client';
import type { Tracker } from '@searchspring/snap-tracker';
import { DomTargeter, getScriptContext } from '@searchspring/snap-toolbox';
import { AbstractController, RecommendationController } from '@searchspring/snap-controller';
import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager, Middleware } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

export type RecommendationInstantiatorConfig = {
	components: {
		[name: string]: React.ElementType<{ controller: any }>;
	};
	selector?: string;
	branch: string;
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
	eventManager: EventManager;
	plugins: { (cntrlr: AbstractController): Promise<void> }[] = [];
	middleware: { event: string; func: Middleware<any>[] }[] = [];
	public targets: {
		[key: string]: DomTargeter;
	} = {};

	constructor(config: RecommendationInstantiatorConfig, { client, logger, tracker }: InstantiatorServices) {
		this.client = client;
		this.tracker = tracker;
		this.eventManager = new EventManager();
		this.config = config;
		this.logger = logger;

		if (!this.config.branch) {
			throw new Error(`Instantiator config must contain 'branch' property`);
		}

		if (!this.config.components || typeof this.config.components != 'object') {
			throw new Error(`Instantiator config must contain 'components' mapping property`);
		}

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
							// TODO DomTargeter - deal with no return
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

				const urlManager = new UrlManager(new UrlTranslator(), reactLinker).detach();
				const recs = new RecommendationController(
					{
						id: `recommend_${tag + (profileCount[tag] - 1)}`,
						tag,
						branch: this.config.branch,
						globals,
					},
					{
						client: this.client,
						store: new RecommendationStore({}, { urlManager }),
						urlManager,
						eventManager: new EventManager(),
						profiler: new Profiler(),
						logger: new Logger(),
						tracker: this.tracker,
					}
				);

				this.plugins.forEach((plugin) => recs.use(plugin));
				this.middleware.forEach((middleware) => recs.on(middleware.event, ...middleware.func));

				await recs.init();
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

				const RecommendationsComponent = this.config.components[profileVars.component];
				if (!RecommendationsComponent) {
					recs.log.error(`component '${profileVars.component}' not found!`);
				}

				render(<RecommendationsComponent controller={recs} />, injectedElem);
			}
		);
	}

	public async use(func: (cntrlr: AbstractController) => Promise<void>): Promise<void> {
		this.plugins.push(func);
	}

	public on<T>(event: string, ...func: Middleware<T>[]): void {
		this.middleware.push({ event, func });
	}
}
