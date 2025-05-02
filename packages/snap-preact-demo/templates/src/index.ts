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
			extends: 'bocachica',
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
				/*
					default: {
						// other things
						components: {}
					}
					mobile: {
						components: {}
					}
					tablet: {
						components: {}
					}
					desktop: {
						components: {}
					}
				*/

				// defaults
				components: {},

				// mobile, tablet, desktop
				// responsive: {
				// 	mobile: {
				// 		components: {
				// 			'toolbar.top': {
				// 				layout: ['pagination']
				// 			},
				// 			'searchBoca toolbar.top': {
				// 				layout: ['perPage']
				// 			},
				// 			'search toolbar.top': {
				// 				layout: ['sortBy']
				// 			},
				// 			'searchBoca search toolbar.top': {
				// 				layout: ['paginationInfo']
				// 			}
				// 		}
				// 	},
				// 	tablet: {

				// 	},
				// 	desktop: {
				// 		components: {
				// 			'toolbar.top': {
				// 				layout: ['pagination']
				// 			},
				// 			'searchBoca toolbar.top': {
				// 				layout: ['perPage']
				// 			},
				// 			'search toolbar.top': {
				// 				layout: ['facetsHorizontal']
				// 			},
				// 			'searchBoca search toolbar.top': {
				// 				layout: ['sortBy']
				// 			}
				// 		}
				// 	}
				// },
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
