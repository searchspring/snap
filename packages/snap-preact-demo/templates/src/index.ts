import { SnapTemplates } from '@searchspring/snap-preact';
import { CustomResult } from './components/Result';
import { globalStyles } from './styles';

// import { en_translation, fr_translation } from '@searchspring/snap-preact/translations';

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
		// translations: {
		// 	en: en_translation,
		// 	fr: fr_translation,
		// }
	},
	components: {
		result: {
			CustomResult: () => CustomResult,
			CustomResultSecondary: async () => (await import('./components/Result')).CustomResultSecondary,
		},
		badge: {
			// CustomPill: async () => (await import('./components/Result')).Result,
		},
	},
	themes: {
		// myTheme: {
		// 	extends: 'pike',
		// },
		global: {
			extends: 'bocachica',
			variables: {
				colors: {
					primary: 'red',
					secondary: 'blue',
				},
				breakpoints: [0, 768, 1024, 1280],
			},
			style: globalStyles,
			overrides: {
				components: {
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
					{},
				],
			},
		},
		// otherTheme: {
		// 	extends: 'pike',
		// },
	},
	search: {
		targets: [
			{
				selector: '#searchspring-layout',
				component: 'Search',
				resultComponent: 'CustomResultSecondary',
			},
		],
	},
	recommendation: {
		settings: {
			branch: BRANCHNAME,
		},
		bundle: {
			Bundle: {
				component: 'RecommendationBundle',
				// resultComponent: 'CustomResultSecondary',
			},
		},
		default: {
			Recs: {
				component: 'Recommendation',
				// resultComponent: 'CustomResultSecondary',
			},
		},
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
