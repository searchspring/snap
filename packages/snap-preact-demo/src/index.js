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

/* local imports */
import { Content } from './components/Content/Content';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Loading } from './components/Loading/Loading';

import { afterStore } from './middleware/plugins/afterStore';
import { scrollToTop, timeout, ensure, until } from './middleware/functions';

import './styles/custom.scss';

/*
	configuration and instantiation
 */

let globals = {
	siteId: 'scmq7n',
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

	controller.store.custom.version = versionText;

	// add elements and inject when ready
	const breadcrumbs = await until(() => {
		return document.querySelector('.ss-lite-breadcrumbs ul');
	});

	const crumb = document.createElement('li');
	crumb.className = 'snap-version';
	breadcrumbs.append(crumb);

	render(
		<>
			<i class="ss-lite-icon fas fa-chevron-right"></i>
			<span style="font-size: 9px;">{` ${cntrlr.store.custom.version}`}</span>
		</>,
		document.querySelector('.snap-version')
	);

	await next();
});

cntrlr.on('init', async ({ controller }, next) => {
	const loadingDiv = document.createElement('div');
	loadingDiv.id = 'searchspring-loading';

	const body = await until(() => document.body);
	body.append(loadingDiv);

	await next();
});

// delaying the search
cntrlr.on('afterSearch', async ({ controller, response }, next) => {
	// await timeout(3333);
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

// run initial search
// cntrlr.urlManager.set('query', 'blue').go();
cntrlr.search();

// for testing purposes
window.sssnap = {
	search: cntrlr,
};

/*
	render targets
 */

render(<Sidebar store={cntrlr.store} />, document.getElementById('searchspring-sidebar'));
render(<Content store={cntrlr.store} />, document.getElementById('searchspring-content'));
