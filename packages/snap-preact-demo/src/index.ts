import deepmerge from 'deepmerge';

import { Snap } from '@searchspring/snap-preact';
import { StorageStore } from '@searchspring/snap-store-mobx';
import { url } from '@searchspring/snap-toolbox';
// import { afterSearch } from './middleware/plugins/afterSearch';
import { afterStore } from './middleware/plugins/afterStore';
import { combineMerge } from './middleware/functions';
import { ContentSkel } from './components/Content/Skel';
import { SidebarSkel } from './components/Sidebar/Skel';

import './styles/custom.scss';

// storage for custom configuration
const configStore = new StorageStore({ type: 'local', key: 'ss-demo-config' });

/*
	configuration and instantiation
 */

let siteId = '8uyt2m';
let customOrigin = '';
let clientConfig = {};

// grab siteId out of the URL
const urlObj = url(window.location.href);
const urlSiteIdParam = urlObj.params.query.siteId || urlObj.params.query.siteid;
const urlOriginParam = urlObj.params.query.origin;

// custom siteId
if (urlSiteIdParam && urlSiteIdParam.match(/[a-zA-Z0-9]{6}/)) {
	siteId = urlSiteIdParam;
	configStore.set('siteId', siteId);

	// clear previously stored storage
	window.localStorage.removeItem('ss-history');
	window.sessionStorage.removeItem('ss-controller-search');
	window.sessionStorage.removeItem('ss-controller-autocomplete');
} else {
	// use siteId from storage
	const storedSiteId = configStore.get('siteId');
	if (storedSiteId) siteId = storedSiteId;
}

if (urlOriginParam) {
	customOrigin = urlOriginParam;
	configStore.set('origin', urlOriginParam);
} else {
	const storedOrigin = configStore.get('origin');
	if (storedOrigin) customOrigin = storedOrigin;
}

// if there is a custom origin set clientConfig

if (customOrigin) {
	clientConfig = {
		meta: {
			origin: customOrigin,
		},
		search: {
			origin: customOrigin,
		},
		autocomplete: {
			requesters: {
				suggest: {
					origin: customOrigin,
				},
				legacy: {
					origin: customOrigin,
				},
			},
		},
		finder: {
			origin: customOrigin,
		},
		// recommend: {
		// 	origin: recommendOrigin,
		// },
		suggest: {
			origin: customOrigin,
		},
	};
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
		config: clientConfig,
	},
	instantiators: {
		recommendation: {
			components: {
				Recs: async () => {
					return (await import('./components/Recommendations/Recs/Recs')).Recs;
				},
				Bundle: async () => {
					return (await import('./components/Recommendations/Bundles/Bundles')).Bundles;
				},
				Default: async () => {
					return (await import('./components/Recommendations/Recs/Recs')).Recs;
				},
				Email: async () => {
					return (await import('./components/Recommendations/Email/Email')).Email;
				},
			},

			config: {
				branch: BRANCHNAME,
				plugins: [],
				settings: {
					variants: {
						field: 'ss_variants',
					},
				},
			},
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					plugins: [[afterStore]],
					settings: {
						redirects: {
							merchandising: false,
							singleResult: false,
						},
						variants: {
							field: 'ss_variants',
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
						renderAfterSearch: true,
						skeleton: () => ContentSkel,
						component: async () => {
							return (await import('./components/Content/Content')).Content;
						},
					},
					{
						selector: '#searchspring-sidebar',
						hideTarget: true,
						renderAfterSearch: true,
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
