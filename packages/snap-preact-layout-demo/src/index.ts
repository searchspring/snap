import { SnapLayout } from '@searchspring/snap-preact';
import { searchMobile } from './layouts/mobile/searchMobile';
import { searchTablet } from './layouts/tablet/searchTablet';
import { searchDesktop } from './layouts/desktop/searchDesktop';
import { acDesktop } from './layouts/desktop/acDesktop';
import { acMobile } from './layouts/mobile/acMobile';
import { acTablet } from './layouts/tablet/acTablet';
import { recsMobile } from './layouts/mobile/recsMobile';
import { recsTablet } from './layouts/tablet/recsTablet';
import { recsDesktop } from './layouts/desktop/recsDesktop';

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
	platform: 'custom',
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
				breakpoints: [searchMobile, searchTablet, searchDesktop],
			},
			{
				selector: '#searchspring-sidebar',
				breakpoints: [searchMobile, searchTablet, searchDesktop],
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
				breakpoints: [recsMobile, recsTablet, recsDesktop],
			},
		],
	},
	autocomplete: {
		inputSelector: 'input.searchspring-ac',
		layouts: [
			{
				selector: 'input.searchspring-ac',
				breakpoints: [acMobile, acTablet, acDesktop],
			},
		],
	},
});
