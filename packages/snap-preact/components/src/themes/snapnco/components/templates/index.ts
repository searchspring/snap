// TEMPLATES
import { recommendation } from './recommendation';
import { recommendationBundle } from './recommendationBundle';
import { recommendationBundleEasyAdd } from './recommendationBundleEasyAdd';
import { recommendationBundleList } from './recommendationBundleList';
import { recommendationBundleVertical } from './recommendationBundleVertical';
import { recommendationGrid } from './recommendationGrid';
import { recommendationEmail } from './recommendationEmail';
import { search } from './search';
import { searchHorizontal } from './searchHorizontal';
import { autocompleteTemplate } from './autocompleteTemplate';

export const templates = {
	default: {
		autocompleteTemplate: autocompleteTemplate.default,
		recommendation: recommendation.default,
		recommendationBundle: recommendationBundle.default,
		recommendationBundleEasyAdd: recommendationBundleEasyAdd.default,
		recommendationBundleList: recommendationBundleList.default,
		recommendationBundleVertical: recommendationBundleVertical.default,
		recommendationGrid: recommendationGrid.default,
		recommendationEmail: recommendationEmail.default,
		search: search.default,
		searchHorizontal: searchHorizontal.default,
	},
	mobile: {
		autocompleteTemplate: autocompleteTemplate.mobile,
		recommendation: recommendation.mobile,
		recommendationBundle: recommendationBundle.mobile,
		recommendationBundleEasyAdd: recommendationBundleEasyAdd.mobile,
		recommendationBundleList: recommendationBundleList.mobile,
		recommendationBundleVertical: recommendationBundleVertical.mobile,
		recommendationGrid: recommendationGrid.mobile,
		recommendationEmail: recommendationEmail.mobile,
		search: search.mobile,
		searchHorizontal: searchHorizontal.mobile,
	},
	tablet: {
		autocompleteTemplate: autocompleteTemplate.tablet,
		recommendation: recommendation.tablet,
		recommendationBundle: recommendationBundle.tablet,
		recommendationBundleEasyAdd: recommendationBundleEasyAdd.tablet,
		recommendationBundleList: recommendationBundleList.tablet,
		recommendationBundleVertical: recommendationBundleVertical.tablet,
		recommendationGrid: recommendationGrid.tablet,
		recommendationEmail: recommendationEmail.tablet,
		search: search.tablet,
		searchHorizontal: searchHorizontal.tablet,
	},
	desktop: {
		autocompleteTemplate: autocompleteTemplate.desktop,
		recommendation: recommendation.desktop,
		recommendationBundle: recommendationBundle.desktop,
		recommendationBundleEasyAdd: recommendationBundleEasyAdd.desktop,
		recommendationBundleList: recommendationBundleList.desktop,
		recommendationBundleVertical: recommendationBundleVertical.desktop,
		recommendationGrid: recommendationGrid.desktop,
		recommendationEmail: recommendationEmail.desktop,
		search: search.desktop,
		searchHorizontal: searchHorizontal.desktop,
	},
};
