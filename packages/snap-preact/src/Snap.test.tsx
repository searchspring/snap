import { MockClient } from '@searchspring/snap-shared';
import { Tracker } from '@searchspring/snap-tracker';
import { Logger } from '@searchspring/snap-logger';
import { cookies } from '@searchspring/snap-toolbox';

import type {
	SearchControllerConfig,
	AutocompleteControllerConfig,
	FinderControllerConfig,
	RecommendationControllerConfig,
} from '@searchspring/snap-controller';

import { Snap, BRANCH_COOKIE } from './Snap';
import { AutocompleteStore } from '@searchspring/snap-store-mobx';

const baseConfig = {
	client: {
		globals: {
			siteId: '8uyt2m',
		},
	},
};

const Component = (props) => {
	const controller = props.controller;
	return <div className="injectedComponent">{controller.type}</div>;
};

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('Snap Preact', () => {
	beforeEach(() => {
		delete window.searchspring;
		cookies.unset(BRANCH_COOKIE);

		document.body.innerHTML = `<script id="searchspring-context"></script><div id="searchspring-content"></div>`;
	});

	it('throws if configuration is not provided', () => {
		expect(() => {
			// @ts-ignore - testing bad instantiation
			const snap = new Snap();
		}).toThrow();
	});

	it('throws if configuration is not complete', () => {
		const config = {
			client: {},
		};

		expect(() => {
			// @ts-ignore - testing bad instantiation
			const snap = new Snap(config);
		}).toThrow();
	});

	it('uses the logger to log an error when no context is found', () => {
		document.body.innerHTML = '';

		const logger = new Logger('Snap Preact ');
		const spy = jest.spyOn(logger, 'error');
		const snap = new Snap(baseConfig, { logger });
		expect(spy).toHaveBeenCalledWith('failed to find global context');
	});

	it('creates a proper Snap object with minimal configuration', () => {
		const snap = new Snap(baseConfig);

		// services are defined
		expect(snap.logger).toBeDefined();
		expect(snap.client).toBeDefined();
		expect(snap.tracker).toBeDefined();

		// properties are defined
		expect(snap.config).toStrictEqual(baseConfig);
		expect(snap.context).toStrictEqual({});
		expect(snap.controllers).toStrictEqual({});

		// @ts-ignore - checking private property
		expect(snap.client.globals.siteId).toBe(baseConfig.client.globals.siteId);
	});

	it('merges config found in context and prioritizes the config found in the context', () => {
		document.body.innerHTML = `<script id="searchspring-context">config = { client: { globals: { siteId: 'yyyyyy' } } };</script>`;

		const snap = new Snap(baseConfig);

		// @ts-ignore - checking private property
		expect(snap.client.globals.siteId).toBe('yyyyyy');
	});

	it('merges contexts and prioritizes the context found in the script', () => {
		document.body.innerHTML = `<script id="searchspring-context">shopper = { id: 'snapdevscript' };</script>`;

		const contextConfig = {
			...baseConfig,
			context: {
				shopper: {
					id: 'snapdevconfig',
				},
			},
		};

		const snap = new Snap(contextConfig);
		expect(snap.context.shopper.id).toBe('snapdevscript');
	});

	it('has branch override functionality', () => {
		const branchParam = 'override';
		cookies.set(BRANCH_COOKIE, branchParam, 'Lax', 3600000);

		const logger = new Logger('Snap Preact ');
		const spy = jest.spyOn(logger, 'warn');
		const snap = new Snap(baseConfig, { logger });
		expect(spy).toHaveBeenCalledWith(`...loading build... '${branchParam}'`);
	});

	it('exposes itself globally on the window', () => {
		const snap = new Snap(baseConfig);
		expect(window.searchspring).toBeDefined();
		expect(window.searchspring.context).toBe(snap.context);
		expect(window.searchspring.client).toBe(snap.client);
	});

	it('automatically tracks the shopper id when provided', () => {
		const contextConfig = {
			...baseConfig,
			context: {
				shopper: {
					id: 'snapdev',
				},
			},
		};

		const tracker = new Tracker(baseConfig.client.globals);
		const spy = jest.spyOn(tracker.track.shopper, 'login');
		const snap = new Snap(contextConfig, { tracker });
		expect(spy).toHaveBeenCalledWith({ id: contextConfig.context.shopper.id });
	});

	it('automatically sets the shopper cart when provided', () => {
		const contextConfig = {
			...baseConfig,
			context: {
				shopper: {
					id: 'snapdev',
					cart: [{ sku: 'sku1' }, { sku: 'sku2' }, { sku: 'sku3' }],
				},
			},
		};

		const tracker = new Tracker(baseConfig.client.globals);
		const spy = jest.spyOn(tracker.cookies.cart, 'set');
		const snap = new Snap(contextConfig, { tracker });
		expect(spy).toHaveBeenCalledWith(['sku1', 'sku2', 'sku3']);
	});

	describe('creates search controllers via config', () => {
		it(`can create a search controller`, () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
								settings: {
									redirects: {
										merchandising: false,
									},
								},
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			const search = snap.controllers.search;
			expect(search).toBeDefined();
			expect(search.id).toBe('search');
			expect(search.type).toBe('search');
			expect((search.config as SearchControllerConfig).settings.redirects.merchandising).toBe(false);

			// it has not searched and is not searching
			expect(search.store.loading).toBe(false);
			expect(search.store.loaded).toBe(false);
		});

		it(`can create multiple search controllers`, () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'searchOne',
							},
						},
						{
							config: {
								id: 'searchTwo',
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			expect(snap.controllers.searchOne).toBeDefined();
			expect(snap.controllers.searchTwo).toBeDefined();
		});

		it(`does not run the controller 'search' method when a targeter is NOT found`, async () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-dne',
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			const client = new MockClient(baseConfig.client.globals, {});
			const spy = jest.spyOn(client, 'search');
			const snap = new Snap(searchConfig, { client });

			const search = snap.controllers.search;
			expect(search).toBeDefined();

			await wait();

			expect(spy).toHaveBeenCalledTimes(0);
			expect(search.store.loading).toBe(false);
			expect(search.store.loaded).toBe(false);
		});

		it(`logs an error when targeter has invalid configuration`, async () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									hideTarget: true,
									component: () => Component,
								},
							],
						},
					],
				},
			};

			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			new Snap(searchConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(0);

			// @ts-ignore - allowing for invalid component
			searchConfig.controllers.search[0].targeters[0].component = Component;
			new Snap(searchConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(1);

			delete searchConfig.controllers.search[0].targeters[0].selector;
			new Snap(searchConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(2);

			searchConfig.controllers.search[0].targeters[0].selector = '#searchspring-content';
			delete searchConfig.controllers.search[0].targeters[0].component;
			new Snap(searchConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(3);
		});

		it(`runs the controller 'search' method when a targeter selector is found`, async () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			const client = new MockClient(baseConfig.client.globals, {});
			const spy = jest.spyOn(client, 'search');
			const snap = new Snap(searchConfig, { client });

			const search = snap.controllers.search;
			expect(search).toBeDefined();

			await wait();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(search.store.loading).toBe(false);
			expect(search.store.loaded).toBe(true);
		});

		it(`runs the onTarget function when a targeter selector is found`, async () => {
			const onTarget = jest.fn();

			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									hideTarget: true,
									onTarget,
									component: () => Component,
								},
							],
						},
					],
				},
			};

			const client = new MockClient(baseConfig.client.globals, {});
			const snap = new Snap(searchConfig, { client });

			const search = snap.controllers.search;
			expect(search).toBeDefined();

			await wait();

			expect(onTarget).toHaveBeenCalledTimes(1);
		});

		it(`runs the controller 'search' method when prefetch is set when selector not found`, async () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									prefetch: true,
									selector: '#searchspring-dne',
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			const client = new MockClient(baseConfig.client.globals, {});
			const spy = jest.spyOn(client, 'search');
			const snap = new Snap(searchConfig, { client });

			const search = snap.controllers.search;
			expect(search).toBeDefined();

			await wait();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(search.store.loading).toBe(false);
			expect(search.store.loaded).toBe(true);
		});
	});

	describe('creates autocomplete controllers via config', () => {
		it(`can create an autocomplete controller`, async () => {
			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								id: 'ac',
								selector: '.ss-ac-input',
								settings: {
									initializeFromUrl: false,
								},
							},
						},
					],
				},
			};
			const snap = new Snap(acConfig);

			const autocomplete = await snap.getController('ac');
			expect(autocomplete.id).toBe('ac');
			expect(autocomplete.type).toBe('autocomplete');
			expect((autocomplete.config as AutocompleteControllerConfig).settings.initializeFromUrl).toBe(false);

			// it has not searched and is not searching
			expect(autocomplete.store.loading).toBe(false);
			expect(autocomplete.store.loaded).toBe(false);
		});

		it(`can create multiple autocomplete controllers`, async () => {
			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input-one',
								id: 'acOne',
							},
						},
						{
							config: {
								selector: '.ss-ac-input-two',
								id: 'acTwo',
							},
						},
					],
				},
			};
			const snap = new Snap(acConfig);
			const [acOne, acTwo] = await snap.getControllers('acOne', 'acTwo');
			expect(acOne.id).toBe('acOne');
			expect(acOne.type).toBe('autocomplete');
			expect(acTwo.id).toBe('acTwo');
			expect(acTwo.type).toBe('autocomplete');
		});

		it(`logs an error when targeter has invalid configuration`, async () => {
			document.body.innerHTML = `<script id="searchspring-context"></script><input type="text" class="ss-ac-input"/>`;

			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input',
								id: 'ac',
							},
							targeters: [
								{
									selector: '.ss-ac-input',
									hideTarget: true,
									component: async () => Component,
								},
							],
						},
					],
				},
			};

			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			new Snap(acConfig, { logger });
			await wait();
			expect(spy).toHaveBeenCalledTimes(0);

			delete acConfig.controllers.autocomplete[0].targeters[0].selector;
			new Snap(acConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(1);

			acConfig.controllers.autocomplete[0].targeters[0].selector = '#searchspring-content';
			delete acConfig.controllers.autocomplete[0].targeters[0].component;
			new Snap(acConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it(`creates targeter provided in config`, async () => {
			document.body.innerHTML = `<script id="searchspring-context"></script><input type="text" class="ss-ac-input"/>`;

			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input',
								id: 'ac',
							},
							targeters: [
								{
									name: 'acTarget',
									selector: '.ss-ac-input',
									hideTarget: true,
									component: async () => Component,
								},
							],
						},
					],
				},
			};
			const snap = new Snap(acConfig);
			const ac = await snap.getController('ac');
			await wait();
			expect(ac.id).toBe('ac');
			expect(ac.targeters.acTarget).toBeDefined();
			expect((ac.store as AutocompleteStore).state.input).toBeUndefined();
		});

		it(`runs the onTarget function when a targeter selector is found`, async () => {
			const onTarget = jest.fn();

			document.body.innerHTML = `<script id="searchspring-context"></script><input type="text" class="ss-ac-input"/>`;

			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input',
								id: 'ac',
							},
							targeters: [
								{
									selector: '.ss-ac-input',
									hideTarget: true,
									component: async () => Component,
									onTarget,
								},
							],
						},
					],
				},
			};
			const snap = new Snap(acConfig);
			const ac = await snap.getController('ac');
			await wait();
			expect(onTarget).toHaveBeenCalledTimes(1);
		});
	});

	describe('creates finder controllers via config', () => {
		it(`can create a finder controller`, async () => {
			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finder',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
						},
					],
				},
			};
			const snap = new Snap(finderConfig);

			const finder = await snap.getController('finder');
			expect(finder.id).toBe('finder');
			expect(finder.type).toBe('finder');

			// it has not searched and is not searching
			expect(finder.store.loading).toBe(false);
			expect(finder.store.loaded).toBe(false);
		});

		it(`can create multiple finder controllers`, async () => {
			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finderOne',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
						},
						{
							config: {
								id: 'finderTwo',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
						},
					],
				},
			};
			const snap = new Snap(finderConfig);
			const [finderOne, finderTwo] = await snap.getControllers('finderOne', 'finderTwo');
			expect(finderOne.id).toBe('finderOne');
			expect(finderOne.type).toBe('finder');
			expect(finderTwo.id).toBe('finderTwo');
			expect(finderTwo.type).toBe('finder');
		});

		it(`logs an error when targeter has invalid configuration`, async () => {
			document.body.innerHTML = `<script id="searchspring-context"></script><div id="searchspring-finder-hierarchy"></div>`;

			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finder',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
							targeters: [
								{
									name: 'finder_hierarchy',
									selector: '#searchspring-finder-hierarchy',
									component: async () => Component,
								},
							],
						},
					],
				},
			};

			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			new Snap(finderConfig, { logger });
			await wait();
			expect(spy).toHaveBeenCalledTimes(0);

			delete finderConfig.controllers.finder[0].targeters[0].selector;
			new Snap(finderConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(1);

			finderConfig.controllers.finder[0].targeters[0].selector = '#searchspring-content';
			delete finderConfig.controllers.finder[0].targeters[0].component;
			new Snap(finderConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it(`creates targeter provided in config`, async () => {
			document.body.innerHTML = `<script id="searchspring-context"></script><div id="searchspring-finder-hierarchy"></div>`;

			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finder',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
							targeters: [
								{
									name: 'finderTargeter',
									selector: '#searchspring-finder-hierarchy',
									component: async () => Component,
								},
							],
						},
					],
				},
			};
			const snap = new Snap(finderConfig);
			const finder = await snap.getController('finder');
			await wait();
			expect(finder.id).toBe('finder');
			expect(finder.targeters.finderTargeter).toBeDefined();
		});

		it(`runs the onTarget function when a targeter selector is found`, async () => {
			const onTarget = jest.fn();

			document.body.innerHTML = `<script id="searchspring-context"></script><div id="searchspring-finder-hierarchy"></div>`;

			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finder',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
							targeters: [
								{
									name: 'finderTargeter',
									selector: '#searchspring-finder-hierarchy',
									component: async () => Component,
									onTarget,
								},
							],
						},
					],
				},
			};
			const snap = new Snap(finderConfig);
			const finder = await snap.getController('finder');
			await wait();
			expect(onTarget).toHaveBeenCalledTimes(1);
		});
	});

	describe('creates recommendation controllers via config', () => {
		it(`can create a recommendation controller`, async () => {
			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecs',
								tag: 'trending',
							},
						},
					],
				},
			};
			const snap = new Snap(recommendationConfig);

			const finder = await snap.getController('trendingRecs');
			expect(finder.id).toBe('trendingRecs');
			expect(finder.type).toBe('recommendation');

			// it has not searched and is not searching
			expect(finder.store.loading).toBe(false);
			expect(finder.store.loaded).toBe(false);
		});

		it(`can create multiple recommendation controllers`, async () => {
			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecsOne',
								tag: 'trending',
							},
						},
						{
							config: {
								id: 'trendingRecsTwo',
								tag: 'trending',
							},
						},
					],
				},
			};
			const snap = new Snap(recommendationConfig);
			const [trendingRecsOne, trendingRecsTwo] = await snap.getControllers('trendingRecsOne', 'trendingRecsTwo');
			expect(trendingRecsOne.id).toBe('trendingRecsOne');
			expect(trendingRecsOne.type).toBe('recommendation');
			expect(trendingRecsTwo.id).toBe('trendingRecsTwo');
			expect(trendingRecsTwo.type).toBe('recommendation');
		});

		it(`logs an error when targeter has invalid configuration`, async () => {
			document.body.innerHTML = `<script id="searchspring-context"></script><div id="ss-trending-recs"></div>`;

			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecs',
								tag: 'trending',
							},
							targeters: [
								{
									name: 'recsTargeter',
									selector: '#ss-trending-recs',
									component: async () => Component,
								},
							],
						},
					],
				},
			};

			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			new Snap(recommendationConfig, { logger });
			await wait();
			expect(spy).toHaveBeenCalledTimes(0);

			delete recommendationConfig.controllers.recommendation[0].targeters[0].selector;
			new Snap(recommendationConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(1);

			recommendationConfig.controllers.recommendation[0].targeters[0].selector = '#ss-trending-recs';
			delete recommendationConfig.controllers.recommendation[0].targeters[0].component;
			new Snap(recommendationConfig, { logger });
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it(`creates targeter provided in config`, async () => {
			document.body.innerHTML = `<script id="searchspring-context"></script><div id="ss-trending-recs"></div>`;

			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecs',
								tag: 'trending',
							},
							targeters: [
								{
									name: 'recsTargeter',
									selector: '#ss-trending-recs',
									component: async () => Component,
								},
							],
						},
					],
				},
			};
			const snap = new Snap(recommendationConfig);
			const recommendation = await snap.getController('trendingRecs');
			await wait();
			expect(recommendation.id).toBe('trendingRecs');
			expect(recommendation.targeters.recsTargeter).toBeDefined();
		});

		it(`runs the onTarget function when a targeter selector is found`, async () => {
			const onTarget = jest.fn();

			document.body.innerHTML = `<script id="searchspring-context"></script><div id="ss-trending-recs"></div>`;

			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecs',
								tag: 'trending',
							},
							targeters: [
								{
									name: 'recsTargeter',
									selector: '#ss-trending-recs',
									component: async () => Component,
									onTarget,
								},
							],
						},
					],
				},
			};
			const snap = new Snap(recommendationConfig);
			const recommendation = await snap.getController('trendingRecs');
			await wait();
			expect(onTarget).toHaveBeenCalledTimes(1);
		});
	});

	describe(`the 'getInstantiator' method`, () => {
		it('rejects if requested instantiator does not exist', async () => {
			const snap = new Snap(baseConfig);

			await expect(async () => {
				await snap.getInstantiator('recommendations');
			}).rejects.toBe(`getInstantiator could not find instantiator with id: recommendations`);
		});

		it('returns an instantiator when the requested id exists', async () => {
			const instantiatorConfig = {
				...baseConfig,
				instantiators: {
					recommendation: {
						components: {},
						config: {
							branch: 'production',
						},
					},
				},
			};
			const snap = new Snap(instantiatorConfig);

			const instantiator = await snap.getInstantiator('recommendations');
			expect(instantiator).toBeDefined();
			expect(instantiator.config.config.branch).toBe('production');
		});
	});

	describe(`the 'getController(s)' method`, () => {
		it('rejects if requested controller does not exist', async () => {
			const snap = new Snap(baseConfig);

			await expect(async () => {
				await snap.getController('search');
			}).rejects.toBe(`getController could not find controller with id: search`);
		});

		it('returns a controller with the requested id when it exists', async () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			const search = await snap.getController('search');
			expect(search).toBeDefined();
			expect(search.id).toBe('search');
		});

		it('rejects if requested controller does not exist', async () => {
			const snap = new Snap(baseConfig);

			await expect(async () => {
				const [searchOne, searchTwo] = await snap.getControllers('searchOne', 'searchTwo');
			}).rejects.toBe(`getController could not find controller with id: searchOne`);
		});

		it('rejects if requested controller does not exist', async () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'searchOne',
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			await expect(async () => {
				const [searchOne, searchTwo] = await snap.getControllers('searchOne', 'searchTwo');
			}).rejects.toBe(`getController could not find controller with id: searchTwo`);
		});

		it('returns controllers with the requested ids when they exists', async () => {
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'searchOne',
							},
						},
						{
							config: {
								id: 'searchTwo',
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			const [searchOne, searchTwo] = await snap.getControllers('searchOne', 'searchTwo');
			expect(searchOne).toBeDefined();
			expect(searchOne.id).toBe('searchOne');
			expect(searchTwo).toBeDefined();
			expect(searchTwo.id).toBe('searchTwo');
		});
	});

	describe(`the 'createController' method`, () => {
		it('can create a search controller', async () => {
			const snap = new Snap(baseConfig);
			const searchConfig = {
				id: 's',
			};

			const search = await snap.createController('search', searchConfig);
			expect(search.id).toBe(searchConfig.id);
			expect(search.type).toBe('search');
		});

		it('can create an autocomplete controller', async () => {
			const snap = new Snap(baseConfig);
			const autocompleteConfig = {
				id: 'ac',
			};

			const autocomplete = await snap.createController('autocomplete', autocompleteConfig);
			expect(autocomplete.id).toBe(autocompleteConfig.id);
			expect(autocomplete.type).toBe('autocomplete');
		});

		it('can create a finder controller', async () => {
			const snap = new Snap(baseConfig);
			const finderConfig = {
				id: 'f',
			};

			const finder = await snap.createController('finder', finderConfig);
			expect(finder.id).toBe(finderConfig.id);
			expect(finder.type).toBe('finder');
		});

		it('can create a recommendation controller', async () => {
			const snap = new Snap(baseConfig);
			const recommendationConfig = {
				tag: 'profile',
				id: 'rec',
			};

			const recommendation = await snap.createController('recommendation', recommendationConfig);
			expect(recommendation.id).toBe(recommendationConfig.id);
			expect(recommendation.type).toBe('recommendation');
		});

		it('executes an optional callback function when creating a controller', async () => {
			const snap = new Snap(baseConfig);
			const searchConfig = {
				id: 's',
			};

			const callback = jest.fn();
			const search = await snap.createController('search', searchConfig, undefined, undefined, undefined, callback);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(search);
		});
	});
});
