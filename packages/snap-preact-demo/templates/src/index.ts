import { SnapTemplates } from '@searchspring/snap-preact';
// import { globalStyles } from './styles';
// import { CustomResult } from './components/Result';
// import { Recommendation } from '@searchspring/snap-preact/components'
import { globalStyles } from './styles';
import deepmerge from 'deepmerge';
import { combineMerge } from '../../snap/src/middleware/functions';
import { SnapTemplatesConfig } from '@searchspring/snap-preact';

let config: SnapTemplatesConfig = {
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
		platform: 'shopify',
	},
	components: {
		result: {
			CustomResult: async () => (await import('./components/Result')).CustomResult,
		},
		badge: {
			// CustomPill: async () => (await import('./components/Result')).Result,
		},
	},
	themes: {
		// myTheme: {
		// 	extends: 'base',
		// 	// resultComponent: 'CustomResult',
		// },
		global: {
			extends: 'bocachica',
			// resultComponent: 'CustomResultSecondary',
			// resultComponent: 'Global',
			// resultComponent: 'CustomResult',
			// variables: {
			// 	colors: {
			// 		primary: 'red',
			// 		secondary: 'blue',
			// 	},
			// 	breakpoints: [768, 1024, 1280],
			// },
			variables: {
				breakpoints: [768, 1024, 1280],
				colors: {
					primary: '#6d7175',
					secondary: '#202223',
					accent: '#333333',
				},
			},
			style: globalStyles,
			overrides: {
				components: {
					recommendation: {
						lazyRender: {
							enabled: false,
						},
					},
					recommendationBundle: {
						lazyRender: {
							enabled: false,
						},
					},
					noResults: {
						templates: {
							recommendation: {
								enabled: true,
								component: 'Recommendation',
								// resultComponent: 'Global',
								config: {
									tag: 'similar',
								},
							},
						},
					},
					price: {
						// style: {
						// 	background: 'red',
						// },
					},
					toolbar: {
						hidePerPage: true,
						// hidePagination: true,
						// style: {
						// 	background: 'red',
						// },
					},

					'toolbar.top': {
						hidePerPage: true,
						hidePagination: true,
					},

					'search toolbar.top': {
						hidePerPage: false,
						hidePagination: false,
					},

					'search toolbar': {
						hidePerPage: false,
						// style: {
						// 	background: 'blue'
						// }
					},

					'search toolbar.bottom': {
						hidePerPage: false,
						hidePagination: false,
						// style: {
						// 	background: 'pink',
						// },
					},

					// 'icon.next': {
					// 	icon: 'cog',
					// },

					// 'carousel icon.next': {
					// 	icon: 'cog',
					// },

					// 'pagination icon.next': {
					// 	icon: 'cog',
					// },
				},
				layoutOptions: [
					{
						value: 2,
						label: 'two',
						overrides: {
							components: {
								toolbar: {
									hideSortBy: true,
								},
								results: {
									columns: 2,
								},
							},
						},
					},
					{
						value: 4,
						label: 'four',
						default: true,
						overrides: {
							components: {
								results: {
									columns: 4,
								},
							},
						},
					},
				],
				// responsive: [
				// 	{
				// 		components: {
				// 			pagination: {
				// 				hideLast: true,
				// 			},
				// 		},
				// 		layoutOptions: [
				// 			{
				// 				value: 1,
				// 				label: 'one',
				// 				overrides: {
				// 					components: {
				// 						toolbar: {
				// 							hideSortBy: true,
				// 						},
				// 						results: {
				// 							columns: 1,
				// 						},
				// 					},
				// 				},
				// 			},
				// 			{
				// 				value: 3,
				// 				label: 'three',
				// 				default: true,
				// 				overrides: {
				// 					components: {
				// 						results: {
				// 							columns: 3,
				// 						},
				// 					},
				// 				},
				// 			},
				// 		],
				// 	},
				// 	{
				// 		// layoutOptions: [],
				// 	},
				// 	{},
				// ],
			},
		},
		// otherTheme: {
		// 	extends: 'bocachica',
		// },
	},
	recommendation: {
		// bundle: {
		// 	Bundle: {
		// 		component:'RecommendationBundleList',
		// 		// resultComponent: "CustomResult"
		// 	},
		// },
		// 	// 	//todo get these set up when the smc can pick these as default templates
		// 	// 	// EasyAdd: {
		// 	// 	// 	component: "RecommendationBundleEasyAdd",
		// 	// 	// },
		// 	// 	// List: {
		// 	// 	// 	component: "RecommendationBundleList",
		// 	// 	// },
		// 	// 	// Vertical: {
		// 	// 	// 	component: "RecommendationBundleVertical",
		// 	// 	// }
		// 	// },
		email: {
			Email: {
				component: 'RecommendationEmail',
			},
		},
		default: {
			Default: {
				component: 'Recommendation',
				// resultComponent: "CustomResult"
			},
		},
	},
	search: {
		// settings: {
		// 	infinite: {
		// 		backfill: 0,
		// 	}
		// },
		targets: [
			{
				selector: '#searchspring-layout',
				// theme: 'myTheme',
				component: 'Search',
				// resultComponent: 'CustomResult',
			},
		],
	},
	autocomplete: {
		inputSelector: 'input.searchspring-ac',
		targets: [
			{
				selector: 'input.searchspring-ac',
				// theme: 'myTheme',
				component: 'Autocomplete',
				// resultComponent: 'CustomResult',
			},
		],
	},
};

if (window.mergeSnapConfig) {
	config = deepmerge(config, window.mergeSnapConfig, { arrayMerge: combineMerge });
}

new SnapTemplates(config);
