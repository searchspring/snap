import { SnapTemplates } from '@searchspring/snap-preact';
import { CustomResult } from './components/Result';
import { globalStyles } from './styles';

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
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
		myTheme: {
			extends: 'pike',
		},
		global: {
			extends: 'bocachica',
			variables: {
				color: {
					primary: 'red',
					secondary: 'blue',
				},
				breakpoints: [0, 768, 1024, 1280],
			},
			style: globalStyles,
			overrides: {
				components: {
					/*
					named components at the root / theme level

					toolbar__search--top;
					toolbar__search--bottom;
					icon__carousel--previous;
					icon__carousel--next;
					icon__bundleRecommendation--cta;
					icon__bundleRecommendation--selected;
					bundleRecommendation: {
						theme: {
							components: {
								icon__carousel--previous: {}
							}
						}
					}
					toolbar__horizontalSearch--bottom;
					toolbar__horizontalSearch--bottom;

					*/

					// 'search results price.one other stuff': {
					// 	lineThrough: true,

					// 	named: {
					// 		'one': {

					// 		}
					// 	}
					// },
					price: {
						// fakeProp: 'yes',
						lineThrough: !!1,
					},

					search: {
						// nope: true,
						// hideBottomToolBar: 'yes',
						// toggleSidebarButtonText: 4
					},

					'toolbar.top price.one': {
						lineThrough: true,
					},

					'search toolbar price.one': {
						lineThrough: true,
					},

					// 'search toolbar.top price.one': {
					// 	lineThrough: true,
					// },

					'price.one': {
						lineThrough: true,
					},
					// 'price': {
					// 	lineThrough: false
					// },

					'something price.two': {},

					// search: {
					// 	theme: {
					// 		components: {
					// 			// can we type this for the search component? (individual components)
					// 			toolbar: {
					// 				hidePerPage: true,
					// 				style: {
					// 					background: 'red',
					// 				},
					// 			},
					// 			// toolbar: {},
					// 		},
					// 	},
					// },
					// toolbar: {
					// 	hidePerPage: true,
					// },

					// // type__${uniqueName}

					// toolbar__searchTop: {},
					// toolbar__searchBottom: {},
					// toolbar__horizontalSearchTop: {},
					// toolbar__horizontalSearchMiddle: {},
					// toolbar__horizontalSearchBottom: {},

					// icon__carouselPreviousButton: {},
					// icon__carouselNextButton: {},
					// icon__ratingEmptyStar: {},

					// toolbar__top: {},
					// toolbar__middle: {},
					// toolbar__bottom: {},

					// icon__
					// 'icon__carousel--previous': {},
					// 'icon__ss__carousel__button--previous__icon--previous': {},
					// icon__previous: {},

					// 'results__search': {},
					// 'results__horizontalSearch': {},
					// 'results__autocomplete': {},
					// 'toolbar__horizontalSearchTop': {},
					// 'toolbar__horizontalSearchTop': {},
					// 'toolbar__searchTop': {
					// hidePerPage: false,
					// style: {
					// 	background: 'blue',
					// 	zoom: 2
					// }
					// },
					// thingDoesntExist: {},
					// toolbar__topThing: {
					// 	hidePerPage: false,
					// 	style: {
					// 		background: 'blue',
					// 		zoom: 2
					// 	}
					// },
					// toolbar__top: {},
					// toolbar__bottom: {},

					// toolbar: {
					// 	named: {
					// 		top: {

					// 		},
					//		buttum: {}
					// 	}
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
								// results: {
								// 	named: {
								// 		searchResults: { columns: 2 },
								// 	},
								// },
							},
						},
					},
					{
						value: 4,
						label: 'four',
						default: true,
						overrides: {
							components: {
								// results: {
								// 	named: {
								// 		searchResults: { columns: 4 },
								// 	},
								// },
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
						// layoutOptions: [],
					},
					{
						// layoutOptions: [],
					},
					{},
					{},
				],
			},
		},
		otherTheme: {
			extends: 'pike',
		},
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
		templates: {
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
				theme: 'myTheme',
				component: 'Autocomplete',
				// resultComponent: 'CustomResult',
			},
		],
	},
});
