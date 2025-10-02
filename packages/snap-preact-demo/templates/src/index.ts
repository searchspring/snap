import { SnapTemplates } from '@searchspring/snap-preact';
import { globalStyles } from './styles';
import deepmerge from 'deepmerge';
import { combineMerge } from '../../snap/src/middleware/functions';
import type { SnapTemplatesConfig } from '@searchspring/snap-preact';
import { ClientConfig } from '@searchspring/snap-client';

const siteId = '8uyt2m';

const clientConfig: ClientConfig = {
	meta: {
		origin: `https://${siteId}.a.searchspring.io`,
	},
	search: {
		origin: `https://${siteId}.a.searchspring.io`,
	},
	autocomplete: {
		requesters: {
			suggest: {
				origin: `https://${siteId}.a.searchspring.io`,
			},
			legacy: {
				origin: `https://${siteId}.a.searchspring.io`,
			},
		},
	},
	finder: {
		origin: `https://${siteId}.a.searchspring.io`,
	},
	recommend: {
		origin: `https://${siteId}.a.searchspring.io`,
	},
	suggest: {
		origin: `https://${siteId}.a.searchspring.io`,
	},
};

let config: SnapTemplatesConfig = {
	config: {
		siteId,
		language: 'en',
		currency: 'usd',
		platform: 'other',
		client: clientConfig,
	},
	components: {
		result: {
			CustomResult: async () => (await import('./components/Result')).CustomResult,
		},
	},
	theme: {
		extends: 'base',
		variables: {
			breakpoints: {
				mobile: 768,
				tablet: 1024,
				desktop: 1280,
			},
			// colors: {
			// 	primary: '#6d7175',
			// 	secondary: '#202223',
			// 	accent: '#333333',
			// },
		},
		style: globalStyles,
		overrides: {},
	},
	recommendation: {
		email: {
			Email: {
				component: 'RecommendationEmail',
			},
		},
		default: {
			Default: {
				component: 'Recommendation',
			},
		},
		bundle: {
			Bundle: {
				component: 'RecommendationBundle',
			},
		},
	},
	search: {
		targets: [
			{
				selector: '#searchspring-layout',
				component: 'Search',
			},
		],
	},
	autocomplete: {
		targets: [
			{
				selector: 'input.searchspring-ac',
				component: 'AutocompleteFixed',
			},
		],
	},
};

if (window.mergeSnapConfig) {
	config = deepmerge(config, window.mergeSnapConfig, { arrayMerge: combineMerge });
}

new SnapTemplates(config);

/*

Overrides are taking priority over the theme layouts (responsive) specified within the Search component - but they shouldn't be.
Look into:
			overrides: {
				'toolbar.top': {
					layout: [
						['Banner.header'],
					]
				},
				'toolbar.middle': {
					layout: [
						['_', 'Pagination'],
						['Pagination'],
						['Pagination'],
						['Pagination'],
						['Pagination'],
						['Banner.banner']
					]
				},
			},

*/
