import { SnapTemplates } from '@searchspring/snap-preact';
import { Result, Result2 } from './components/Result';
import { icon2path, icon3path, icon4path } from './icons/icons';
import { globalStyles } from './styles';
// templates.addComponent('results', 'Result', Result);
// templates.addComponent('badges', 'Star', StarComponent);
// templates.addTheme('themeName', ThemeObj);

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'aud',
	},
	components: {
		result: {
			Result: () => Result,
			Result2: () => Result2,
			CustomResult: async () => (await import('./components/Result')).Result2,
		},
		badge: {
			// CustomPill: async () => (await import('./components/Result')).Result,
		},
	},
	themes: {
		global: {
			name: 'bocachica',
			// variables: {
			// 	breakpoints: [0],
			// 	color: {}
			// },
			style: globalStyles,
			overrides: {
				components: {
					horizontalFacets: {
						overlay: true,
						alwaysShowFiltersButton: true,
					},
					toolbar: {
						named: {
							topToolBar: {
								hideFilterSummary: true,
								hideLayoutSelector: false,
								hidePerPage: true,
								hideSortBy: false,
								hidePagination: true,
								style: {
									background: 'red',
									order: 1,
									'& .ss__toolbar__layout-selector': { order: 2 },
									'& .ss__toolbar__sort-by': { order: 1 },
								},
							},
						},
					},
					searchHeader: {
						titleText: (data) => `${data.pagination.totalResults} products`,
						className: 'product-count__text',
						style: {
							order: 2,
							textAlign: 'left',
						},
					},
					noResults: {
						templates: {
							recommendation: {
								enabled: true,
								component: 'Recommendation',
								resultComponent: 'Result',
								config: {
									tag: 'trending',
								},
								// '& a': {
								// 	color: 'unset',
								// 	textDecoration: 'none',
								// }
							},
						},
					},
				},
				layoutOptions: [
					{
						value: 2,
						label: '2',
						icon: {
							path: icon2path,
							viewBox: '0 0 25 20',
							className: 'icon icon-grid-2',
							size: '25px',
							// style: {
							// 	'fill': 'none',
							// 	'stroke': 'currentColor',
							// },
						},
						overrides: {
							components: {
								results: {
									named: {
										searchResults: { columns: 2 },
									},
								},
							},
						},
					},
					{
						value: 3,
						label: '3',
						icon: {
							path: icon3path,
							viewBox: '0 0 32 20',
							className: 'icon icon-grid-3',
							size: '25px',
							// style: {
							// 	'fill': 'none',
							// 	'stroke': 'currentColor',
							// },
						},
						overrides: {
							components: {
								results: {
									named: {
										searchResults: { columns: 3 },
									},
								},
							},
						},
					},
					{
						value: 4,
						label: '4',
						default: true,
						icon: {
							path: icon4path,
							viewBox: '0 0 39 20',
							className: 'icon icon-grid-4',
							size: '25px',
							// style: {
							// 	'fill': 'none',
							// 	'stroke': 'currentColor',
							// },
						},
						overrides: {
							components: {
								results: {
									named: {
										searchResults: { columns: 4 },
									},
								},
							},
						},
					},
				],
				responsive: [
					{
						layoutOptions: [],
					},
					{
						layoutOptions: [],
					},
					{},
					{},
				],
			},
		},
		otherTheme: {
			name: 'pike',
		},
	},
	search: {
		targets: [
			{
				selector: '#searchspring-layout',
				component: 'Search',
				// theme: 'Pike',
				// component: 'HorizontalSearch',
				resultComponent: 'Result',
			},
		],
	},
	// TODO: make extendible for future global template additions / modifications (need to verify component names for current global recs templates)
	// TODO: remove need for recommendation config except for when extending or overwriting defaults
	recommendation: {
		settings: {
			branch: BRANCHNAME,
		},
		templates: {
			Recs: {
				component: 'Recommendation',
				resultComponent: 'Result',
			},
			// bundle: {
			// 	component: 'BundleRecommendation',
			// 	resultComponent: 'Result',
			// },
			// email: {
			// 	component: 'EmailRecommendation',
			// 	resultComponent: 'Result',
			// },
		},
	},
	autocomplete: {
		inputSelector: 'input.searchspring-ac',
		targets: [
			{
				selector: 'input.searchspring-ac',
				component: 'Autocomplete',
				resultComponent: 'Result',
			},
		],
	},
});
