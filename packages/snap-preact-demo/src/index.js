import 'preact/debug';
import { h, Fragment, render } from 'preact';

/* searchspring imports */

import { Snap } from '@searchspring/snap-preact';
import { Autocomplete } from '@searchspring/snap-preact-components';
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

const config = {
	client: {
		globals: {
			siteId: '8uyt2m',
		},
	},
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
				targets: [
					{
						selector: '#searchspring-content',
						component: Content,
						hideTarget: true,
					},
					{
						selector: '#searchspring-sidebar',
						component: Sidebar,
						hideTarget: true,
					},
				],
			},
		],
		autocomplete: [
			{
				config: {
					id: 'autocomplete',
					selector: 'input.searchspring-ac',
				},
				targets: [
					{
						selector: '.ss-ac-target',
						component: Autocomplete,
						hideTarget: true,
					},
				],
			},
		],
	},
};

const snap = new Snap(config);
const { search, autocomplete } = snap.controllers;

// custom store manipulation
search.on('afterStore', async ({ controller }, next) => {
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
search.use(afterStore);

// using a function
search.on('afterStore', scrollToTop);

/*

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

*/
