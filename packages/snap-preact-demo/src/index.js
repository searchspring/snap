import 'preact/debug';
import { h, Fragment, render } from 'preact';
import deepmerge from 'deepmerge';
/* searchspring imports */

import { Snap } from '@searchspring/snap-preact';

import { afterStore } from './middleware/plugins/afterStore';
import { configurable } from './middleware/plugins/configurable';
import { combineMerge } from './middleware/functions';

import './styles/custom.scss';

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
					plugins: [[afterStore], [configurable, 'param1', 'param2']],
					settings: {
						redirects: {
							merchandising: false,
						},
						// infinite: {
						// 	backfill: 5,
						// },
					},
				},
				targets: [
					{
						selector: '#searchspring-content',
						hideTarget: true,
						prefetch: true,
						component: async () => {
							return (await import('./components/Content/Content')).Content;
						},
					},
					{
						selector: '#searchspring-sidebar',
						// component: Sidebar,
						hideTarget: true,
						prefetch: true,
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
	},
};

// used to add config settings from cypress e2e tests
if (window?.mergeSnapConfig) {
	config = deepmerge(config, window.mergeSnapConfig, { arrayMerge: combineMerge });
}

const snap = new Snap(config);
const { search, autocomplete } = snap.controllers;

// attaching plugins
// search.plugin(afterStore);
// search.plugin(configurable, 'param1', 'param2');
