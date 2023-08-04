import { SnapLayout } from '@searchspring/snap-preact';
import { resultLayout } from './resultLayout';

import * as themes from './themes';

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

new SnapLayout({
	config: {
		theme: themes.pike,
		language: 'en',
		currency: 'usd',
		breakpoints: [0, 767, 991],
	},
	search: {
		// settings: {
		// 	infinite: {
		// 		backfill: 5,
		// 	}
		// },
		layouts: [
			{
				selector: '#searchspring-layout',
				template: 'Search',
				resultLayout: resultLayout,
			},
		],
	},
	recommendation: {
		settings: {
			branch: BRANCHNAME,
		},
		layouts: [
			{
				component: 'Recs',
				template: 'Recommendation',
				resultLayout: resultLayout,
			},
		],
	},
	autocomplete: {
		inputSelector: 'input.searchspring-ac',
		layouts: [
			{
				selector: 'input.searchspring-ac',
				template: 'Autocomplete',
				resultLayout: resultLayout,
			},
		],
	},
});
