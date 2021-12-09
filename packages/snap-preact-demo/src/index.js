import deepmerge from 'deepmerge';

import { Snap } from '@searchspring/snap-preact';
import { getContext } from '@searchspring/snap-toolbox';

import { afterStore } from './middleware/plugins/afterStore';
import { configurable } from './middleware/plugins/configurable';
import { combineMerge } from './middleware/functions';
import { ContentSkel } from './components/Content/Skel';
import { SidebarSkel } from './components/Sidebar/Skel';

import './styles/custom.scss';

/*
	context
 */

const context = getContext(['shopper']);

/*
	configuration and instantiation
 */

let config = {
	context,
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
					plugins: [[afterStore], [configurable, 'thing1', 'thing2']],
					settings: {
						redirects: {
							merchandising: false,
						},
					},
				},
				targeters: [
					{
						selector: '#searchspring-content',
						hideTarget: true,
						// prefetch: true,
						skeleton: () => ContentSkel,
						component: async () => {
							return (await import('./components/Content/Content')).Content;
						},
					},
					{
						selector: '#searchspring-sidebar',
						hideTarget: true,
						// prefetch: true,
						skeleton: () => SidebarSkel,
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

const snap = new Snap(config);
