import { SnapTemplate } from '@searchspring/snap-preact';
import type { SnapTemplateConfig } from '@searchspring/snap-preact';
import { mobileLayout } from './layout/layouts/mobile/searchMobile';
import { tabletLayout } from './layout/layouts/tablet/searchTablet';
import { desktopLayout } from './layout/layouts/desktop/searchDesktop';
import { acDesktop } from './layout/layouts/desktop/acDesktop';
import { acMobile } from './layout/layouts/mobile/acMobile';
import { acTablet } from './layout/layouts/tablet/acTablet';
import { autocompleteStyling } from './styles/autocomplete';
import { recsMobile } from './layout/layouts/mobile/recsMobile';
import { recsTablet } from './layout/layouts/tablet/recsTablet';
import { recsDesktop } from './layout/layouts/desktop/recsDesktop';

/*
	configuration and instantiation
 */

const config: SnapTemplateConfig = {
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
};

SnapTemplate(config);
