import 'preact/debug';
import { h, Fragment, render } from 'preact';
import deepmerge from 'deepmerge';
/* searchspring imports */

import { afterStore } from './middleware/plugins/afterStore';
import { configurable } from './middleware/plugins/configurable';
import { combineMerge } from './middleware/functions';

import './styles/custom.scss';

import { Snap } from '@searchspring/snap-preact';
/*
	configuration and instantiation
 */

let config = {
	url: {
		settings: {
			coreType: 'query',
			customType: 'query',
		},
		parameters: {
			core: {
				query: { name: 'q' },
				page: { name: 'p' },
			},
		},
	},
	client: {
		globals: {
			siteId: '8uyt2m',
		},
	},
	instantiators: {
		recommendation: {
			components: {
				Recs: async () => {
					return (await import('./components/Recommendations/')).Recs;
				},
			},

			config: {
				branch: BRANCHNAME,
			},
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					// new plugins format to allow for parameters
					// plugins: [[afterStore], [configurable, 'param1', 'param2']],
					middleware: {
						init: ({ controller }, next) => {
							console.log('in config init...', controller);
							next();
						},
					},
					settings: {
						redirects: {
							merchandising: false,
						},
						infinite: {
							backfill: 5,
						},
					},
				},
				targeters: [
					{
						selector: '#searchspring-content',
						hideTarget: true,
						// prefetch: true,
						component: async () => {
							return (await import('./components/Content/Content')).Content;
						},
					},
					{
						selector: '#searchspring-sidebar',
						// component: Sidebar,
						hideTarget: true,
						// prefetch: true,
						component: async () => {
							return (await import('./components/Sidebar/Sidebar')).Sidebar;
						},
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
				targeters: [
					{
						selector: 'input.searchspring-ac',
						// component: Autocomplete,
						hideTarget: true,
						component: async () => {
							return (await import('./components/Autocomplete/Autocomplete')).Autocomplete;
						},
					},
				],
			},
		],
		finder: [
			{
				config: {
					id: 'finder',
					url: '/',
					fields: [
						{
							field: 'size_footwear',
							label: 'Size',
						},
						{
							field: 'color_family',
							label: 'Color',
						},
						{
							field: 'brand',
							label: 'Brand',
						},
					],
				},
				targeters: [
					{
						name: 'finder',
						selector: '#finder',
						component: async () => {
							return (await import('./components/Finder/Finder')).Finder;
						},
					},
				],
			},
		],
	},
};

// used to add config settings from cypress e2e tests
if (window?.mergeSnapConfig) {
	config = deepmerge(config, window.mergeSnapConfig, { arrayMerge: combineMerge });
}

const searchspring = new Snap(config);

searchspring.getController('search').then((search) => {
	// attaching plugins
	search.plugin(afterStore);
	search.plugin(configurable, 'param1', 'param2');
});

// this thing...
searchspring.getRecommendations.then((recommendations) => {
	recommendations.on('init', ({ controller }, next) => {
		console.log('initing recs', controller);
		next();
	});

	recommendations.plugin((controller) => {
		console.log('plugin to recs', controller);
	});

	recommendations.use({
		plugins: [
			[
				(controller) => {
					console.log('plugin to recs with use', controller);
				},
			],
		],
		middleware: {
			init: ({ controller }, next) => {
				console.log('initing recs with use', controller);
				next();
			},
		},
	});
});
