import deepmerge from 'deepmerge';

import { Snap } from '@searchspring/snap-preact';
import { url } from '@searchspring/snap-toolbox';

import { afterStore } from './middleware/plugins/afterStore';
import { combineMerge } from './middleware/functions';
import { ContentSkel } from './components/Content/Skel';
import { SidebarSkel } from './components/Sidebar/Skel';

import './styles/custom.scss';

/*
	configuration and instantiation
 */

let siteId = '8uyt2m';
// grab siteId out of the URL
const urlObj = url(window.location.href);
const urlSiteIdParam = urlObj.params.query.siteId;
if (urlSiteIdParam && urlSiteIdParam.match(/[a-zA-Z0-9]{6}/)) {
	siteId = urlSiteIdParam;
}

let config: SnapConfig = {
	mode: 'development', // should be removed for 'production' usage
	features: {
		integratedSpellCorrection: {
			enabled: true,
		},
	},
	url: {
		parameters: {
			core: {
				query: { name: 'q' },
			},
		},
	},
	client: {
		globals: {
			siteId,
		},
	},
	instantiators: {
		recommendation: {
			components: {
				Recs: async () => {
					return (await import('./components/Recommendations/Recs/Recs')).Recs;
				},
				Email: async () => {
					return (await import('./components/Recommendations/Email/Email')).Email;
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
						infinite: {
							backfill: 15,
							// restorePosition: false,
						},
					},
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
						skeleton: () => ContentSkel,
						component: async () => {
							return (await import('./components/Content/Content')).Content;
						},
					},
					{
						selector: '#searchspring-sidebar',
						hideTarget: true,
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
						history: {
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
						selector: '#searchspring-finder',
						component: async () => {
							return (await import('./components/Finder/Finder')).Finder;
						},
					},
				],
			},
			{
				config: {
					id: 'finder_hierarchy',
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
if (window.mergeSnapConfig) {
	config = deepmerge(config, window.mergeSnapConfig, { arrayMerge: combineMerge });
}

const snap = new Snap(config);
