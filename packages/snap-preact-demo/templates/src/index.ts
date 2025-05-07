import { SnapTemplates } from '@searchspring/snap-preact';
import { globalStyles } from './styles';
import deepmerge from 'deepmerge';
import { combineMerge } from '../../snap/src/middleware/functions';
import { SnapTemplatesConfig } from '@searchspring/snap-preact';

let config: SnapTemplatesConfig = {
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
		platform: 'other',
	},
	components: {
		result: {
			CustomResult: async () => (await import('./components/Result')).CustomResult,
		},
	},
	themes: {
		global: {
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
			overrides: {
				// defaults
				components: {},

				// mobile, tablet, desktop
				responsive: {
					mobile: {},
					tablet: {},
					desktop: {},
				},
			},
		},
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
				component: 'AutocompleteTemplate',
			},
		],
	},
};

if (window.mergeSnapConfig) {
	config = deepmerge(config, window.mergeSnapConfig, { arrayMerge: combineMerge });
}

new SnapTemplates(config);
