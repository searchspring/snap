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
	instantiators: {
		recommendation: {
			branch: BRANCHNAME,
			components: { Recs, Recs2: Recs },
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
						infinite: {
							backfill: true,
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
					settings: {
						trending: {
							limit: 5,
						},
					},
				},
				targets: [
					{
						selector: 'input.searchspring-ac',
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
// search.on('afterStore', scrollToTop);
