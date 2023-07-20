import { SnapLayout } from '@searchspring/snap-preact';
import { mobileLayout } from './layouts/mobile/searchMobile';
import { tabletLayout } from './layouts/tablet/searchTablet';
import { desktopLayout } from './layouts/desktop/searchDesktop';
import { acDesktop } from './layouts/desktop/acDesktop';
import { acMobile } from './layouts/mobile/acMobile';
import { acTablet } from './layouts/tablet/acTablet';
import { autocompleteStyling } from './styles/autocomplete';
import { recsMobile } from './layouts/mobile/recsMobile';
import { recsTablet } from './layouts/tablet/recsTablet';
import { recsDesktop } from './layouts/desktop/recsDesktop';

/*
	configuration and instantiation
 */

new SnapLayout({
	platform: 'custom',
	siteId: '8uyt2m',
	locale: {},
	ui: {},
	layout: {
		breakpoints: [0, 767, 1024],
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
				breakpoints: [mobileLayout, tabletLayout, desktopLayout],
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
				style: autocompleteStyling,
				breakpoints: [acMobile, acTablet, acDesktop],
			},
		],
	},
});
