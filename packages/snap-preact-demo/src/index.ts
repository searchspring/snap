import deepmerge from 'deepmerge';

import { Snap } from '@searchspring/snap-preact';
import { url } from '@searchspring/snap-toolbox';
// import { afterSearch } from './middleware/plugins/afterSearch';
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
const urlSiteIdParam = urlObj.params.query.siteId || urlObj.params.query.siteid;
const storedSiteIdName = 'ss_siteId';

if (urlSiteIdParam && urlSiteIdParam.match(/[a-zA-Z0-9]{6}/)) {
	siteId = urlSiteIdParam;
	window.localStorage.setItem(storedSiteIdName, siteId);

	// clear previously stored siteId storage
	window.localStorage.removeItem('ss-history');
	window.sessionStorage.removeItem('ss-controller-search');
	window.sessionStorage.removeItem('ss-controller-autocomplete');
} else {
	// use siteId from storage
	const storedSiteId = window.localStorage.getItem(storedSiteIdName);
	if (storedSiteId) siteId = storedSiteId;
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
					plugins: [[afterStore], [badges]],
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

export function badges(controller: AbstractController) {
	const badges = [
		{
			tag: 'on-sale',
			value: '30% Off',
		},
		{
			tag: 'free-shipping',
			value: 'Free Shipping',
		},
		// {
		// 	tag: "new",
		// 	value: "New",
		// },
		{
			tag: 'christmas',
			value: 'https://placehold.co/1000x1000',
		},
	];

	controller.on('afterSearch', async ({ response }, next) => {
		response.meta.badges = {
			locations: {
				overlay: {
					left: [
						{
							name: 'left-upper',
							label: 'Left Upper',
							description: 'description for left upper',
						},
						{
							name: 'left-middle-upper',
							label: 'Left Middle Upper',
							description: 'description for left middle upper',
						},
						{
							name: 'left-middle',
							label: 'Left Middle',
							description: 'description for left middle',
						},
						{
							name: 'left-middle-lower',
							label: 'Left Middle Lower',
							description: 'description for left middle lower',
						},
						{
							name: 'left-lower',
							label: 'Left Lower',
							description: 'description for left lower',
						},
					],
					right: [
						{
							name: 'right-upper',
							label: 'Right Upper',
							description: 'description for right upper',
						},
						{
							name: 'right-middle-upper',
							label: 'Right Middle Upper',
							description: 'description for right middle upper',
						},
						{
							name: 'right-middle',
							label: 'Right Middle',
							description: 'description for right middle',
						},
						{
							name: 'right-middle-lower',
							label: 'Right Middle Lower',
							description: 'description for right middle lower',
						},
						{
							name: 'right-lower',
							label: 'Right Lower',
							description: 'description for right lower',
						},
					],
				},
				callouts: [
					{
						name: 'callout',
						label: 'Callout',
						description: 'description for callout',
					},
				],
			},
			tags: {
				'on-sale': {
					location: 'left-middle',
					component: 'BadgeText',
					priority: 1,
					enabled: true,
					parameters: {
						color: '#0000FF',
						colorText: '#FFFFFF',
					},
				},
				'free-shipping': {
					location: 'callout',
					component: 'BadgeText',
					priority: 1,
					enabled: true,
					parameters: {
						color: '#FF0000',
						colorText: '#FFFFFF',
					},
				},
				christmas: {
					location: 'right-middle',
					component: 'BadgeImage',
					priority: 1,
					enabled: true,
					parameters: {
						url: '//placehold.co/1000x2000',
					},
				},
			},
		};

		response.results = response.results.map((result) => {
			const random = Math.floor(Math.random() * badges.length);
			return {
				...result,
				mappings: {
					...result.mappings,
					badges: [badges[random]],
				},
			};
		});

		await next();
	});
}
