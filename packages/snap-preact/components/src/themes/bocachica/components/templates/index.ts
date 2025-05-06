// TEMPLATES
import { autocompleteTemplate } from './autocompleteTemplate';
// import { recommendation } from './recommendation';
// import { recommendationBundle } from './recommendationBundle';
// import { recommendationBundleEasyAdd } from './recommendationBundleEasyAdd';
// import { recommendationBundleList } from './recommendationBundleList';
// import { recommendationBundleVertical } from './recommendationBundleVertical';
// import { recommendationGrid } from './recommendationGrid';
// import { recommendationEmail } from './recommendationEmail';
// import { search } from './search';
// import { searchHorizontal } from './searchHorizontal';
import { searchBoca } from './searchBoca';
// import { searchSnapnco } from './searchSnapnco';
// import { searchSnappy } from './searchSnappy';
// import { ThemeTemplateProperties } from '../../../../providers';
import { getProps } from '../../../utils/getProps';

export const templates = {
	default: {
		...getProps('autocompleteTemplate', autocompleteTemplate.default),
		// recommendation: recommendation.default,
		// recommendationBundle: recommendationBundle.default,
		// recommendationBundleEasyAdd: recommendationBundleEasyAdd.default,
		// recommendationBundleList: recommendationBundleList.default,
		// recommendationBundleVertical: recommendationBundleVertical.default,
		// recommendationGrid: recommendationGrid.default,
		// recommendationEmail: recommendationEmail.default,
		// search: search.default,
		...getProps('searchBoca', searchBoca.default),
		// '*searchBoca': searchBoca.default?.props,
		// ...(searchBoca.default?.components || {}),

		// searchSnapnco: searchSnapnco.default,
		// searchSnappy: searchSnappy.default,
		// searchHorizontal: searchHorizontal.default,
	},
	mobile: {
		...getProps('autocompleteTemplate', autocompleteTemplate.mobile),
		// recommendation: recommendation.mobile,
		// recommendationBundle: recommendationBundle.mobile,
		// recommendationBundleEasyAdd: recommendationBundleEasyAdd.mobile,
		// recommendationBundleList: recommendationBundleList.mobile,
		// recommendationBundleVertical: recommendationBundleVertical.mobile,
		// recommendationGrid: recommendationGrid.mobile,
		// recommendationEmail: recommendationEmail.mobile,
		// search: search.mobile,
		...getProps('searchBoca', searchBoca.mobile),

		// searchSnapnco: searchSnapnco.mobile,
		// searchSnappy: searchSnappy.mobile,
		// searchHorizontal: searchHorizontal.mobile,
	},
	tablet: {
		...getProps('autocompleteTemplate', autocompleteTemplate.tablet),
		// recommendation: recommendation.tablet,
		// recommendationBundle: recommendationBundle.tablet,
		// recommendationBundleEasyAdd: recommendationBundleEasyAdd.tablet,
		// recommendationBundleList: recommendationBundleList.tablet,
		// recommendationBundleVertical: recommendationBundleVertical.tablet,
		// recommendationGrid: recommendationGrid.tablet,
		// recommendationEmail: recommendationEmail.tablet,
		// search: search.tablet,
		...getProps('searchBoca', searchBoca.tablet),

		// searchSnapnco: searchSnapnco.tablet,
		// searchSnappy: searchSnappy.tablet,
		// searchHorizontal: searchHorizontal.tablet,
	},
	desktop: {
		...getProps('autocompleteTemplate', autocompleteTemplate.desktop),
		// recommendation: recommendation.desktop,
		// recommendationBundle: recommendationBundle.desktop,
		// recommendationBundleEasyAdd: recommendationBundleEasyAdd.desktop,
		// recommendationBundleList: recommendationBundleList.desktop,
		// recommendationBundleVertical: recommendationBundleVertical.desktop,
		// recommendationGrid: recommendationGrid.desktop,
		// recommendationEmail: recommendationEmail.desktop,
		// search: search.desktop,
		...getProps('searchBoca', searchBoca.desktop),
		// searchSnapnco: searchSnapnco.desktop,
		// searchSnappy: searchSnappy.desktop,
		// searchHorizontal: searchHorizontal.desktop,
	},
};
