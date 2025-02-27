// ORGANISMS
import { branchOverride } from './branchOverride';
import { facet } from './facet';
import { facets } from './facets';
import { facetsHorizontal } from './facetsHorizontal';
import { filterSummary } from './filterSummary';
import { mobileSidebar } from './mobileSidebar';
import { noResults } from './noResults';
import { results } from './results';
import { sidebar } from './sidebar';
import { toolbar } from './toolbar';

export const organisms = {
	default: {
		branchOverride: branchOverride.default,
		facet: facet.default,
		facets: facets.default,
		facetsHorizontal: facetsHorizontal.default,
		filterSummary: filterSummary.default,
		mobileSidebar: mobileSidebar.default,
		noResults: noResults.default,
		results: results.default,
		sidebar: sidebar.default,
		toolbar: toolbar.default,
	},
	mobile: {
		branchOverride: branchOverride.mobile,
		facet: facet.mobile,
		facets: facets.mobile,
		facetsHorizontal: facetsHorizontal.mobile,
		filterSummary: filterSummary.mobile,
		mobileSidebar: mobileSidebar.mobile,
		noResults: noResults.mobile,
		results: results.mobile,
		sidebar: sidebar.mobile,
		toolbar: toolbar.mobile,
	},
	tablet: {
		branchOverride: branchOverride.tablet,
		facet: facet.tablet,
		facets: facets.tablet,
		facetsHorizontal: facetsHorizontal.tablet,
		filterSummary: filterSummary.tablet,
		mobileSidebar: mobileSidebar.tablet,
		noResults: noResults.tablet,
		results: results.tablet,
		sidebar: sidebar.tablet,
		toolbar: toolbar.tablet,
	},
	desktop: {
		branchOverride: branchOverride.desktop,
		facet: facet.desktop,
		facets: facets.desktop,
		facetsHorizontal: facetsHorizontal.desktop,
		filterSummary: filterSummary.desktop,
		mobileSidebar: mobileSidebar.desktop,
		noResults: noResults.desktop,
		results: results.desktop,
		sidebar: sidebar.desktop,
		toolbar: toolbar.desktop,
	},
};
