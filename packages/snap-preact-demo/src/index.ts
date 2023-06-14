import deepmerge from 'deepmerge';

import { Snap } from '@searchspring/snap-preact';
import { url, getContext } from '@searchspring/snap-toolbox';

import { afterStore } from './middleware/plugins/afterStore';
import { combineMerge } from './middleware/functions';
import { ContentSkel } from './components/Content/Skel';
import { SidebarSkel } from './components/Sidebar/Skel';

import './styles/custom.scss';

/*
	configuration and instantiation
 */

let siteId = 'b9nhn1';
// grab siteId out of the URL
const urlObj = url(window.location.href);
const urlSiteIdParam = urlObj.params.query.siteId;
if (urlSiteIdParam && urlSiteIdParam.match(/[a-zA-Z0-9]{6}/)) {
	siteId = urlSiteIdParam;
}
const context = getContext(['shopper', 'siteId', 'category', 'brand']);

console.log('getContext returned:', context);

const backgroundFilters = [];

if (context.category?.path) {
	// set category background filter
	backgroundFilters.push({
		field: 'categories_hierarchy',
		value: context.category.path,
		type: 'value',
		background: true,
	});
}

if (context?.brand) {
	// set brand background filter
	backgroundFilters.push({
		field: 'brand',
		value: context.brand,
		type: 'value',
		background: true,
	});
}

// // replace special characters
// function replaceCharacters(value) {
// 	if (value) {
// 		return value
// 			.replace(/\&amp\;/g, '&')
// 			.replace(/\&lt\;/g, '<')
// 			.replace(/\&gt\;/g, '>')
// 			.replace(/\&quot\;/g, '"')
// 			.replace(/\&#039\;/g, "'")
// 			.trim();
// 	} else {
// 		return '';
// 	}
// }

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
					plugins: [[afterStore]],
					globals: {
						filters: backgroundFilters,
					},
					settings: {
						redirects: {
							merchandising: false,
						},
						restorePosition: {
							enabled: true,
						},
						pagination: {
							pageSizeOptions: [
								{
									value: 12,
									label: 'Show 12',
								},
								{
									value: 24,
									label: 'Show 24',
								},
								{
									value: 48,
									label: 'Show 48',
								},
								{
									value: 72,
									label: 'Show 72',
								},
							],
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

new Snap(config);
