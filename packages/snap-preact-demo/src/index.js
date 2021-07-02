import 'preact/debug';
import { h, Fragment, render } from 'preact';

/* searchspring imports */
import { SearchController, RecommendationController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore, RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { DomTargeter, getScriptContext } from '@searchspring/snap-toolbox';
import { Tracker } from '@searchspring/snap-tracker';

/* local imports */
import { Content } from './components/Content/Content';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Recs } from './components/Recommendations/';

import { afterStore } from './middleware/plugins/afterStore';
import { scrollToTop, timeout, ensure, until } from './middleware/functions';

import './styles/custom.scss';

/*
	configuration and instantiation
 */

let globals = {
	siteId: '8uyt2m',
};

const clientConfig = {
	// apiHost: 'http://localhost:8080/api/v1',
};

const cntrlrConfig = {
	id: 'search',
	settings: {
		redirects: {
			merchandising: false,
		},
	},
};

const client = new Client(globals, clientConfig);
const tracker = new Tracker(globals);

const urlManager = new UrlManager(new UrlTranslator(), reactLinker);
const cntrlr = new SearchController(cntrlrConfig, {
	client,
	store: new SearchStore({}, { urlManager, tracker }),
	urlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker,
});

const recsUrlManager = new UrlManager(new UrlTranslator(), reactLinker);
const recommendations = new RecommendationController(
	{ id: 'noresults', tag: 'trending', branch: BRANCHNAME },
	{
		client,
		store: new RecommendationStore({}, { urlManager: recsUrlManager, tracker }),
		urlManager: recsUrlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker,
	}
);

/*
	middlewares
 */

cntrlr.on('init', async ({ controller }, next) => {
	const versionText = 'Snap Preact Demo Store 0.1.3';
	controller.log.imageText({
		url: 'https://searchspring.com/wp-content/themes/SearchSpring-Theme/dist/images/favicons/favicon.svg',
		text: `${versionText}`,
		style: `color: ${controller.log.colors.indigo}; font-weight: bold;`,
	});

	await next();
});

cntrlr.on('init', async ({ controller }, next) => {
	new DomTargeter(
		[
			{
				selector: '#searchspring-content',
				component: <Content controller={{ search: cntrlr, recommendations: { trending: recommendations } }} />,
				hideTarget: true,
			},
		],
		(target, elem) => {
			// run search after finding target
			controller.search();
			render(target.component, elem);
		}
	);

	new DomTargeter(
		[
			{
				selector: '#searchspring-sidebar',
				component: <Sidebar controller={{ search: cntrlr, recommendations: { trending: recommendations } }} />,
				hideTarget: true,
			},
		],
		(target, elem) => {
			render(target.component, elem);
		}
	);

	await next();
});

// custom store manipulation
cntrlr.on('afterStore', async ({ controller }, next) => {
	controller.store.custom.onSaleFacet = controller?.store?.facets.filter((facet) => facet.field == 'on_sale').pop();

	// filtering out certain facets...
	controller.store.facets = controller?.store?.facets?.filter((facet) => facet.field != 'on_sale');

	const colorFacet = controller?.store?.facets.filter((facet) => facet.field == 'color_family').pop();
	colorFacet?.values.forEach((value) => {
		value.custom = {
			colorImage: `www.storfront.com/images/swatches/${value.value}.png`,
		};
	});

	// adding domain to URLs
	controller.store.results.forEach((result) => {
		result.mappings.core.url = 'http://try.searchspring.com' + result.mappings.core.url;
	});

	await next();
});

// using plugins (groups of middleware)
cntrlr.use(afterStore);

// using a function
cntrlr.on('afterStore', scrollToTop);

/*
	initialization
 */

// initialize controller
cntrlr.init();

const recsComponents = {
	Recs,
	Recs2: Recs,
};

const profileCount = {};

// snapify recs proto
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
					// todo DomTargeter - deal with no return
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
		const recs = new RecommendationController(
			{
				id: `recommend_${tag + (profileCount[tag] - 1)}`,
				tag,
				branch: BRANCHNAME,
				globals,
			},
			{
				client,
				store: new RecommendationStore({}, { urlManager: recsUrlManager, tracker }),
				urlManager: new UrlManager(new UrlTranslator(), reactLinker),
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker,
			}
		);

		await recs.init();
		await recs.search();

		const profileVars = recs.store.profile.display.templateParameters;

		if (!profileVars) {
			recs.log.error(`profile failed to load!`);
			return;
		}

		if (!profileVars.component) {
			recs.log.error(`template does not support components!`);
		}

		const RecommendationsComponent = recsComponents[profileVars.component];
		if (!RecommendationsComponent) {
			recs.log.error(`component '${profileVars.component}' not found!`);
		}

		render(<RecommendationsComponent controller={recs} />, injectedElem);
	}
);
