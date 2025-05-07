import { transformThemeComponent } from '../../../utils/transformThemeComponent';
import { ThemeResponsiveComplete } from '../../../../providers';

// ORGANISMS Imports
import { facet } from './facet';
import { facetsHorizontal } from './facetsHorizontal';
import { filterSummary } from './filterSummary';
import { mobileSidebar } from './mobileSidebar';
import { noResults } from './noResults';
import { sidebar } from './sidebar';
import { termsList } from './termsList';
import { toolbar } from './toolbar';

export const organisms: ThemeResponsiveComplete = {
	default: {
		...transformThemeComponent('facet', facet.default),
		...transformThemeComponent('facetsHorizontal', facetsHorizontal.default),
		...transformThemeComponent('filterSummary', filterSummary.default),
		...transformThemeComponent('mobileSidebar', mobileSidebar.default),
		...transformThemeComponent('noResults', noResults.default),
		...transformThemeComponent('sidebar', sidebar.default),
		...transformThemeComponent('toolbar', toolbar.default),
		...transformThemeComponent('termsList', termsList.default),
	},
	mobile: {
		...transformThemeComponent('facet', facet.mobile),
		...transformThemeComponent('facetsHorizontal', facetsHorizontal.mobile),
		...transformThemeComponent('filterSummary', filterSummary.mobile),
		...transformThemeComponent('mobileSidebar', mobileSidebar.mobile),
		...transformThemeComponent('noResults', noResults.mobile),
		...transformThemeComponent('sidebar', sidebar.mobile),
		...transformThemeComponent('toolbar', toolbar.mobile),
		...transformThemeComponent('termsList', termsList.mobile),
	},
	tablet: {
		...transformThemeComponent('facet', facet.tablet),
		...transformThemeComponent('facetsHorizontal', facetsHorizontal.tablet),
		...transformThemeComponent('filterSummary', filterSummary.tablet),
		...transformThemeComponent('mobileSidebar', mobileSidebar.tablet),
		...transformThemeComponent('noResults', noResults.tablet),
		...transformThemeComponent('sidebar', sidebar.tablet),
		...transformThemeComponent('toolbar', toolbar.tablet),
		...transformThemeComponent('termsList', termsList.tablet),
	},
	desktop: {
		...transformThemeComponent('facet', facet.desktop),
		...transformThemeComponent('facetsHorizontal', facetsHorizontal.desktop),
		...transformThemeComponent('filterSummary', filterSummary.desktop),
		...transformThemeComponent('mobileSidebar', mobileSidebar.desktop),
		...transformThemeComponent('noResults', noResults.desktop),
		...transformThemeComponent('sidebar', sidebar.desktop),
		...transformThemeComponent('toolbar', toolbar.desktop),
		...transformThemeComponent('termsList', termsList.desktop),
	},
};
