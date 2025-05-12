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
				components: {
					// 'toolbar.top': {
					// 	layout: ['layoutSelector', 'searchHeader'],
					// },
					// searchHeader: {
					// 	titleText: 'global title text',
					// 	subtitleText: 'global subtitle text',
					// },
					// search: {
					// 	layoutOptions: [
					// 		{
					// 			default: true,
					// 			value: '1',
					// 			label: 'one',
					// 			overrides: {
					// 				components: {
					// 					searchHeader: {
					// 						titleText: 'title text one',
					// 						subtitleText: 'subtitle text one',
					// 					},
					// 				},
					// 			},
					// 		},
					// 		{
					// 			default: false,
					// 			value: '2',
					// 			label: 'two',
					// 			overrides: {
					// 				components: {
					// 					searchHeader: {
					// 						titleText: 'title text two',
					// 						subtitleText: 'subtitle text two',
					// 					},
					// 				},
					// 			},
					// 		},
					// 	],
					// },
				},

				// responsive: {
				// 	mobile: {
				// 		searchHeader: {
				// 			titleText: '0 - 767',
				// 		},
				// 		search: {
				// 			layoutOptions: [
				// 				{
				// 					default: true,
				// 					value: '1',
				// 					label: 'one',
				// 					overrides: {
				// 						components: {
				// 							searchHeader: {
				// 								titleText: 'layout1 0 - 767',
				// 							},
				// 						},
				// 					},
				// 				},
				// 				{
				// 					default: false,
				// 					value: '2',
				// 					label: 'two',
				// 					overrides: {
				// 						components: {
				// 							searchHeader: {
				// 								titleText: 'layout2 0 - 767',
				// 							},
				// 						},
				// 					},
				// 				},
				// 			],
				// 		},
				// 	},
				// 	tablet: {
				// 		searchHeader: {
				// 			titleText: '767 - 991',
				// 		},
				// 		search: {
				// 			layoutOptions: [
				// 				{
				// 					default: true,
				// 					value: '1',
				// 					label: 'one',
				// 					overrides: {
				// 						components: {
				// 							searchHeader: {
				// 								titleText: 'layout1 767 - 991',
				// 							},
				// 						},
				// 					},
				// 				},
				// 				{
				// 					default: false,
				// 					value: '2',
				// 					label: 'two',
				// 					overrides: {
				// 						components: {
				// 							searchHeader: {
				// 								titleText: 'layout2 767 - 991',
				// 							},
				// 						},
				// 					},
				// 				},
				// 			],
				// 		},
				// 	},
				// 	desktop: {
				// 		//only overrides when layoutoptions, if its also in a layout options
				// 		searchHeader: {
				// 			titleText: '991 - 1299',
				// 		},
				// 	},
				// }
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
		bundle: {
			Bundle: {
				component: 'RecommendationBundleVertical',
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
