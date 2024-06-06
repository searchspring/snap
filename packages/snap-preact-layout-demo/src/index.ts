import { SnapTemplates } from '@searchspring/snap-preact';
import { Result, Result2 } from './components/Result';

// templates.addComponent('results', 'Result', Result);
// templates.addComponent('badges', 'Star', StarComponent);
// templates.addTheme('themeName', ThemeObj);

new SnapTemplates({
	// config: {
	// 	language: 'en',
	// 	currency: 'usd',
	// },
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
			overrides: {
				// layoutOptions: [],
				// responsive: [{
				// 	components: {
				// 		results: {
				// 			columns: 6,
				// 		}
				// 	}
				// }],
				components: {
					noResults: {
						templates: {
							recommendation: {
								enabled: true,
								component: 'Recommendation',
								resultComponent: 'Result',
								config: {
									tag: 'trending',
								},
							},
						},
					},
				},
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

// snap.templates.library.addComponentImport('result', 'Result', async () => (await import('./components/Result')).Result);
