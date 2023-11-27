import { SnapTemplates } from '@searchspring/snap-preact';
import { Result } from './components/Result';

/*
	brainstorming...

	prop/theme priorty (highest at the top):
		props
		component theme
		layout theme
		locale theme (theme built into SnapLayout that maps language to props - merge with below)
		theme (eg. pike)

	need a Snap maintained currency->Price component prop mappings
	need a way to add or overwrite any/all currency mappings

	need a Snap maintained language mapping - have to use functions for variables???
	need a way to overwrite any/all language mappings

	need a way to map siteId -> lang/currency/bgFilters
	need a standardized background filter / integration method

	need to solve how to handle root-component prop changes (eg: layout component theme variables change)
		* components should re-render

 */

// {
// 	variables: 	{} | [{},{},{},{}]
// }

/* Project Themes (as opposed to themes per template) */
// const themes = {
// 	global: globalTheme,
// 	boca1: {

// 	}
// }

// new SnapTemplate({
// 	config: {
// 		themes,
// 	}
// });

new SnapTemplates({
	config: {
		language: 'en',
		currency: 'eur',
		themes: {
			global: {
				name: 'bocachica',
				variables: {
					breakpoints: [500, 768, 1024, 1600],
					color: {
						primary: 'yellow',
						secondary: 'yellow',
						accent: 'yellow',
					},
				},
			},
			boca1: {
				name: 'bocachica',
				variables: {
					breakpoints: [500, 768, 1024, 1600],
					color: {
						primary: 'pink',
						secondary: 'pink',
						accent: 'pink',
					},
				},
				overrides: {
					responsive: [
						{
							components: {
								results: {
									columns: 1,
								},
							},
						},
						{},
						{},
						{},
					],
					components: {},
					// variables: {
					// 	color: {
					// 		primary: 'pink',
					// 		secondary: 'pink',
					// 		accent: 'pink',
					// 	},
					// },
				},
			},
			boca2: {
				name: 'bocachica',
				overrides: {
					variables: {
						color: {
							primary: 'cyan',
							secondary: 'cyan',
							accent: 'cyan',
						},
					},
				},
			},
		},
		// theme: {
		/* Current Breakpoint Method */
		// name: 'bocachica',
		// variables: {
		// 	breakpoints: [500, 768, 1024, 1600],
		// 	color: {
		// 		primary: 'red',
		// 		secondary: 'red',
		// 		accent: 'red',
		// 	},
		// },
		// overrides: {
		// responsive: {[{ components: { filterSummary: { hideTitle } }}, theme, theme, theme]}
		// components: {
		// 	facet: {
		// 		color: 'red',
		// 	}
		// },
		// variables: {
		// color: {
		// primary: 'red',
		// secondary: 'red',
		// accent: 'red',
		// },
		// },
		// },
		// },

		/* Future Breakpoint Method ? */
		// 	name: 'bocachica',
		// 	variables: {
		// 		color: {
		// 			primary: 'red',
		// 			secondary: 'red',
		// 			accent: 'red',
		// 		},
		// 	},
		// 	overrides: {
		// 		components: {
		// 			facet: {
		// 				color: 'red',
		// 			}
		// 		},
		// 	},
		// 	responsive: [{ at: '500', overrides: {} }, { at: '768'}, { at: '1024'}, { at: '1600'},]
		// },

		// 	name: 'bocachica',
		// 	variables: {},
		// 	components: {},
		// 	responsive: [{ at: '500' components: {}, variables: {} }, { at: '768' }, { at: '1024' }, { at: '1600' }]
		// },
	},
	search: {
		targets: [
			{
				// theme: {
				// 	name: 'bocachica',
				// 	overrides: {
				// 		variables: {
				// 			color: {
				// 				primary: 'blue',
				// 				secondary: 'blue',
				// 				accent: 'blue',
				// 			},
				// 		},
				// 	},
				// },
				theme: 'boca1',
				selector: '#searchspring-layout',
				template: 'Search',
				// resultComponent: Result,
			},
		],
	},
	recommendation: {
		settings: {
			branch: BRANCHNAME,
		},
		// TODO make better - currently confusing
		targets: [
			{
				component: 'Recs',
				template: 'Recommendation',
				resultComponent: Result,
				// theme: 'boca2',
			},
			{
				component: 'HomePageComponent',
				template: 'Recommendation',
				resultComponent: Result,
				// theme: 'boca1',
			},
		],
	},
	autocomplete: {
		inputSelector: 'input.searchspring-ac',
		targets: [
			{
				// theme: {
				// 	name: 'bocachica',
				// 	overrides: {
				// 		variables: {
				// 			color: {
				// 				primary: 'orange',
				// 				secondary: 'orange',
				// 				accent: 'orange',
				// 			},
				// 		},
				// 	},
				// },
				// theme: 'boca2',
				selector: 'input.searchspring-ac',
				template: 'Autocomplete',
				resultComponent: Result,
			},
		],
	},
});
