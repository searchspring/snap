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
				targets: [
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
			{
				config: {
					id: 'another',
					// new plugins format to allow for parameters
					// plugins: [[afterStore], [configurable, 'param1', 'param2']],
				},
				targets: [
					{
						selector: '#searchspring-contentz',
						hideTarget: true,
						component: async () => {
							return (await import('./components/Content/Content')).Content;
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
				targets: [
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
				targets: [
					{
						selector: '#finderz',
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

// const snap = new Snap(config);
// const { search, autocomplete } = snap.controllers;
// const finder = snap.createController('');

const searchspring = new Snap(config);

// fetch
(async () => {
	const another = await searchspring.getController('another');
	console.log('another', another);
	const search = await searchspring.getController('search');
	console.log('search', search);
	// searchspring.getController('searchs').then(c => {
	// 	c.plugin(afterStore);
	// 	c.plugin(configurable, 'param1', 'param2');
	// })
	// const search = searchspring.controller('search')
	// console.log(search)

	// forever waiting situation on the home page...
	// LOADING...
	// const autocomplete = await searchspring.getController('autocomplete');
	// autocomplete.unbind();
	search.on('init', ({ controller }, next) => {
		console.log('initing', controller);
		next();
	});

	search.on('beforeSearch', ({ controller }) => {
		console.log('beforeSearch', controller);
	});
	// attaching plugins
	search.plugin(afterStore);
	search.plugin(configurable, 'param1', 'param2');
})();

/*
const snap = new Snap(config);


const { search, autocomplete } = await snap.controllers;

OR

const { search, autocomplete } = await snap.getControllers('search', 'autocomplete');
OR
const [search, autocomplete] = await snap.getControllers('search', 'autocomplete');
WITH
const search = await snap.getController('search');

*/
