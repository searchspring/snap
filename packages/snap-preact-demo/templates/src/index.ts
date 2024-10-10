import { SnapTemplates } from '@searchspring/snap-preact';
import { CustomResult } from './components/Result';
import { globalStyles } from './styles';

/*
<script>
	backgroundFilters = [{ field, value, type }];
</script>
*/

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
	},
	platform: {
		// bigcommerce: {
		shopify: {
			backgroundFilters: {
				filters: [
					// {
					// 	type: 'value',
					// 	field: 'ss_tags',
					// 	value: 'context.tags'
					// }
				],
				// tags: [{
				// 	enabled: true,
				// 	field: 'ss_tags',
				// 	value: 'context.tags'
				// }],
				// collection: [{
				// 	enabled: true,
				// 	field: 'collection',
				// 	value: 'context.collection'
				// }],
				// common: [{
				// 	field: 'shopperGroup',
				// 	value: 'shopper.group',
				// 	enabled: true,
				// }]
			},
			mutateResults: {
				url: {
					enabled: true,
				},
			},
			scrollToTop: {
				enabled: true,
				selector: '#searchspring-layout',
				// options: {
				// top: 0,
				// 	left: 0,
				// 	behavior: 'smooth',
				// },
			},
			storeLogger: {
				enabled: true,
			},
		},
	},
	components: {
		result: {
			Global: async () => (await import('./components/Result')).CustomResultSecondary,
			CustomResult: () => CustomResult,
			CustomResultSecondary: async () => (await import('./components/Result')).CustomResultSecondary,
		},
		badge: {
			// CustomPill: async () => (await import('./components/Result')).Result,
		},
	},
	themes: {
		myTheme: {
			extends: 'bocachica',
			resultComponent: 'CustomResult',
		},
		global: {
			extends: 'bocachica',
			// resultComponent: 'CustomResultSecondary',
			// resultComponent: 'Global',
			resultComponent: 'CustomResult',
			variables: {
				colors: {
					primary: 'red',
					secondary: 'blue',
				},
				breakpoints: [768, 1024, 1280],
			},
			style: globalStyles,
			overrides: {
				components: {
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
						style: {
							background: 'red',
						},
					},
					toolbar: {
						hidePerPage: true,
						// hidePagination: true,
						style: {
							background: 'red',
						},
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
						style: {
							background: 'pink',
						},
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
				responsive: [
					{
						components: {
							pagination: {
								hideLast: true,
							},
						},
						layoutOptions: [
							{
								value: 1,
								label: 'one',
								overrides: {
									components: {
										toolbar: {
											hideSortBy: true,
										},
										results: {
											columns: 1,
										},
									},
								},
							},
							{
								value: 3,
								label: 'three',
								default: true,
								overrides: {
									components: {
										results: {
											columns: 3,
										},
									},
								},
							},
						],
					},
					{
						// layoutOptions: [],
					},
					{},
				],
			},
		},
		otherTheme: {
			extends: 'bocachica',
		},
	},
	search: {
		targets: [
			{
				selector: '#searchspring-layout',
				component: 'Search',
				// resultComponent: 'Result',
			},
		],
	},
	autocomplete: {
		inputSelector: 'input.searchspring-ac, .thing2',
		targets: [
			{
				// does this force usage to after the input only?
				selector: 'input.searchspring-ac',
				// theme: 'myTheme',
				component: 'Autocomplete',
				// resultComponent: 'CustomResult',
			},
		],
	},
});
