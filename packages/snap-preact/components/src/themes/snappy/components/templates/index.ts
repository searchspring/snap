import { transformThemeComponent } from '../../../utils/transformThemeComponent';
import { ThemeResponsiveComplete } from '../../../../providers';

// TEMPLATES
import { autocompleteTemplate } from './autocompleteTemplate';
import { recommendation } from './recommendation';
import { recommendationBundle } from './recommendationBundle';
import { recommendationBundleEasyAdd } from './recommendationBundleEasyAdd';
import { recommendationBundleList } from './recommendationBundleList';
import { recommendationBundleVertical } from './recommendationBundleVertical';
import { recommendationGrid } from './recommendationGrid';
import { recommendationEmail } from './recommendationEmail';
import { search } from './search';
import { searchHorizontal } from './searchHorizontal';
import { searchBoca } from './searchBoca';
import { searchSnapnco } from './searchSnapnco';
import { searchSnappy } from './searchSnappy';

export const templates: ThemeResponsiveComplete = {
	default: {
		...transformThemeComponent('autocompleteTemplate', autocompleteTemplate.default),
		...transformThemeComponent('recommendation', recommendation.default),
		...transformThemeComponent('recommendationBundle', recommendationBundle.default),
		...transformThemeComponent('recommendationBundleEasyAdd', recommendationBundleEasyAdd.default),
		...transformThemeComponent('recommendationBundleList', recommendationBundleList.default),
		...transformThemeComponent('recommendationBundleVertical', recommendationBundleVertical.default),
		...transformThemeComponent('recommendationGrid', recommendationGrid.default),
		...transformThemeComponent('recommendationEmail', recommendationEmail.default),
		...transformThemeComponent('search', search.default),
		...transformThemeComponent('searchBoca', searchBoca.default),
		...transformThemeComponent('searchSnapnco', searchSnapnco.default),
		...transformThemeComponent('searchSnappy', searchSnappy.default),
		...transformThemeComponent('searchHorizontal', searchHorizontal.default),
	},
	mobile: {
		...transformThemeComponent('autocompleteTemplate', autocompleteTemplate.mobile),
		...transformThemeComponent('recommendation', recommendation.mobile),
		...transformThemeComponent('recommendationBundle', recommendationBundle.mobile),
		...transformThemeComponent('recommendationBundleEasyAdd', recommendationBundleEasyAdd.mobile),
		...transformThemeComponent('recommendationBundleList', recommendationBundleList.mobile),
		...transformThemeComponent('recommendationBundleVertical', recommendationBundleVertical.mobile),
		...transformThemeComponent('recommendationGrid', recommendationGrid.mobile),
		...transformThemeComponent('recommendationEmail', recommendationEmail.mobile),
		...transformThemeComponent('search', search.mobile),
		...transformThemeComponent('searchBoca', searchBoca.mobile),
		...transformThemeComponent('searchSnapnco', searchSnapnco.mobile),
		...transformThemeComponent('searchSnappy', searchSnappy.mobile),
		...transformThemeComponent('searchHorizontal', searchHorizontal.mobile),
	},
	tablet: {
		...transformThemeComponent('autocompleteTemplate', autocompleteTemplate.tablet),
		...transformThemeComponent('recommendation', recommendation.tablet),
		...transformThemeComponent('recommendationBundle', recommendationBundle.tablet),
		...transformThemeComponent('recommendationBundleEasyAdd', recommendationBundleEasyAdd.tablet),
		...transformThemeComponent('recommendationBundleList', recommendationBundleList.tablet),
		...transformThemeComponent('recommendationBundleVertical', recommendationBundleVertical.tablet),
		...transformThemeComponent('recommendationGrid', recommendationGrid.tablet),
		...transformThemeComponent('recommendationEmail', recommendationEmail.tablet),
		...transformThemeComponent('search', search.tablet),
		...transformThemeComponent('searchBoca', searchBoca.tablet),
		...transformThemeComponent('searchSnapnco', searchSnapnco.tablet),
		...transformThemeComponent('searchSnappy', searchSnappy.tablet),
		...transformThemeComponent('searchHorizontal', searchHorizontal.tablet),
	},
	desktop: {
		...transformThemeComponent('autocompleteTemplate', autocompleteTemplate.desktop),
		...transformThemeComponent('recommendation', recommendation.desktop),
		...transformThemeComponent('recommendationBundle', recommendationBundle.desktop),
		...transformThemeComponent('recommendationBundleEasyAdd', recommendationBundleEasyAdd.desktop),
		...transformThemeComponent('recommendationBundleList', recommendationBundleList.desktop),
		...transformThemeComponent('recommendationBundleVertical', recommendationBundleVertical.desktop),
		...transformThemeComponent('recommendationGrid', recommendationGrid.desktop),
		...transformThemeComponent('recommendationEmail', recommendationEmail.desktop),
		...transformThemeComponent('search', search.desktop),
		...transformThemeComponent('searchBoca', searchBoca.desktop),
		...transformThemeComponent('searchSnapnco', searchSnapnco.desktop),
		...transformThemeComponent('searchSnappy', searchSnappy.desktop),
		...transformThemeComponent('searchHorizontal', searchHorizontal.desktop),
	},
};
