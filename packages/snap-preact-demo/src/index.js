import 'preact/debug';
import { h, Fragment, render } from 'preact';

/* searchspring imports */
import { SearchController } from '@searchspring/snap-controller';
import { SnapClient } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { DomTargeter } from '@searchspring/snap-toolbox';
import { Tracker } from '@searchspring/snap-tracker';

/* local imports */
import { Content } from './components/Content/Content';
import { Sidebar } from './components/Sidebar/Sidebar';

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

const cntrlr = new SearchController(cntrlrConfig, {
	client: new SnapClient(globals, clientConfig),
	store: new SearchStore(),
	urlManager: new UrlManager(new UrlTranslator(), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(globals),
});

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
				component: <Content store={controller.store} />,
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
				component: <Sidebar store={cntrlr.store} />,
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

// for testing purposes
window.sssnap = window.sssnap || {
	search: cntrlr,
};
