import { transformThemeComponent } from '../../../utils/transformThemeComponent';
import { ThemeResponsiveComplete } from '../../../../providers';

// MOLECULES Imports
import { carousel } from './carousel';
import { checkbox } from './checkbox';
import { errorHandler } from './errorHandler';
import { facetGridOptions } from './facetGridOptions';
import { facetHierarchyOptions } from './facetHierarchyOptions';
import { facetListOptions } from './facetListOptions';
import { facetPaletteOptions } from './facetPaletteOptions';
import { facetSlider } from './facetSlider';
import { filter } from './filter';
import { grid } from './grid';
import { layoutSelector } from './layoutSelector';
import { list } from './list';
import { loadMore } from './loadMore';
import { overlayBadge } from './overlayBadge';
import { pagination } from './pagination';
import { radio } from './radio';
import { radioList } from './radioList';
import { result } from './result';
import { searchInput } from './searchInput';
import { select } from './select';
import { slideout } from './slideout';
import { perPage } from './perPage';
import { rating } from './rating';
import { sortBy } from './sortBy';
import { swatches } from './swatches';
import { variantSelection } from './variantSelection';
import { terms } from './terms';

export const molecules: ThemeResponsiveComplete = {
	default: {
		...transformThemeComponent('carousel', carousel.default),
		...transformThemeComponent('checkbox', checkbox.default),
		...transformThemeComponent('errorHandler', errorHandler.default),
		...transformThemeComponent('facetGridOptions', facetGridOptions.default),
		...transformThemeComponent('facetHierarchyOptions', facetHierarchyOptions.default),
		...transformThemeComponent('facetListOptions', facetListOptions.default),
		...transformThemeComponent('facetPaletteOptions', facetPaletteOptions.default),
		...transformThemeComponent('facetSlider', facetSlider.default),
		...transformThemeComponent('filter', filter.default),
		...transformThemeComponent('grid', grid.default),
		...transformThemeComponent('layoutSelector', layoutSelector.default),
		...transformThemeComponent('list', list.default),
		...transformThemeComponent('loadMore', loadMore.default),
		...transformThemeComponent('overlayBadge', overlayBadge.default),
		...transformThemeComponent('pagination', pagination.default),
		...transformThemeComponent('radio', radio.default),
		...transformThemeComponent('radioList', radioList.default),
		...transformThemeComponent('result', result.default),
		...transformThemeComponent('searchInput', searchInput.default),
		...transformThemeComponent('select', select.default),
		...transformThemeComponent('slideout', slideout.default),
		...transformThemeComponent('perPage', perPage.default),
		...transformThemeComponent('rating', rating.default),
		...transformThemeComponent('sortBy', sortBy.default),
		...transformThemeComponent('swatches', swatches.default),
		...transformThemeComponent('variantSelection', variantSelection.default),
		...transformThemeComponent('terms', terms.default),
	},
	mobile: {
		...transformThemeComponent('carousel', carousel.mobile),
		...transformThemeComponent('checkbox', checkbox.mobile),
		...transformThemeComponent('errorHandler', errorHandler.mobile),
		...transformThemeComponent('facetGridOptions', facetGridOptions.mobile),
		...transformThemeComponent('facetHierarchyOptions', facetHierarchyOptions.mobile),
		...transformThemeComponent('facetListOptions', facetListOptions.mobile),
		...transformThemeComponent('facetPaletteOptions', facetPaletteOptions.mobile),
		...transformThemeComponent('facetSlider', facetSlider.mobile),
		...transformThemeComponent('filter', filter.mobile),
		...transformThemeComponent('grid', grid.mobile),
		...transformThemeComponent('layoutSelector', layoutSelector.mobile),
		...transformThemeComponent('list', list.mobile),
		...transformThemeComponent('loadMore', loadMore.mobile),
		...transformThemeComponent('overlayBadge', overlayBadge.mobile),
		...transformThemeComponent('pagination', pagination.mobile),
		...transformThemeComponent('radio', radio.mobile),
		...transformThemeComponent('radioList', radioList.mobile),
		...transformThemeComponent('result', result.mobile),
		...transformThemeComponent('searchInput', searchInput.mobile),
		...transformThemeComponent('select', select.mobile),
		...transformThemeComponent('slideout', slideout.mobile),
		...transformThemeComponent('perPage', perPage.mobile),
		...transformThemeComponent('rating', rating.mobile),
		...transformThemeComponent('sortBy', sortBy.mobile),
		...transformThemeComponent('swatches', swatches.mobile),
		...transformThemeComponent('variantSelection', variantSelection.mobile),
		...transformThemeComponent('terms', terms.mobile),
	},
	tablet: {
		...transformThemeComponent('carousel', carousel.tablet),
		...transformThemeComponent('checkbox', checkbox.tablet),
		...transformThemeComponent('errorHandler', errorHandler.tablet),
		...transformThemeComponent('facetGridOptions', facetGridOptions.tablet),
		...transformThemeComponent('facetHierarchyOptions', facetHierarchyOptions.tablet),
		...transformThemeComponent('facetListOptions', facetListOptions.tablet),
		...transformThemeComponent('facetPaletteOptions', facetPaletteOptions.tablet),
		...transformThemeComponent('facetSlider', facetSlider.tablet),
		...transformThemeComponent('filter', filter.tablet),
		...transformThemeComponent('grid', grid.tablet),
		...transformThemeComponent('layoutSelector', layoutSelector.tablet),
		...transformThemeComponent('list', list.tablet),
		...transformThemeComponent('loadMore', loadMore.tablet),
		...transformThemeComponent('overlayBadge', overlayBadge.tablet),
		...transformThemeComponent('pagination', pagination.tablet),
		...transformThemeComponent('radio', radio.tablet),
		...transformThemeComponent('radioList', radioList.tablet),
		...transformThemeComponent('result', result.tablet),
		...transformThemeComponent('searchInput', searchInput.tablet),
		...transformThemeComponent('select', select.tablet),
		...transformThemeComponent('slideout', slideout.tablet),
		...transformThemeComponent('perPage', perPage.tablet),
		...transformThemeComponent('rating', rating.tablet),
		...transformThemeComponent('sortBy', sortBy.tablet),
		...transformThemeComponent('swatches', swatches.tablet),
		...transformThemeComponent('variantSelection', variantSelection.tablet),
		...transformThemeComponent('terms', terms.tablet),
	},
	desktop: {
		...transformThemeComponent('carousel', carousel.desktop),
		...transformThemeComponent('checkbox', checkbox.desktop),
		...transformThemeComponent('errorHandler', errorHandler.desktop),
		...transformThemeComponent('facetGridOptions', facetGridOptions.desktop),
		...transformThemeComponent('facetHierarchyOptions', facetHierarchyOptions.desktop),
		...transformThemeComponent('facetListOptions', facetListOptions.desktop),
		...transformThemeComponent('facetPaletteOptions', facetPaletteOptions.desktop),
		...transformThemeComponent('facetSlider', facetSlider.desktop),
		...transformThemeComponent('filter', filter.desktop),
		...transformThemeComponent('grid', grid.desktop),
		...transformThemeComponent('layoutSelector', layoutSelector.desktop),
		...transformThemeComponent('list', list.desktop),
		...transformThemeComponent('loadMore', loadMore.desktop),
		...transformThemeComponent('overlayBadge', overlayBadge.desktop),
		...transformThemeComponent('pagination', pagination.desktop),
		...transformThemeComponent('radio', radio.desktop),
		...transformThemeComponent('radioList', radioList.desktop),
		...transformThemeComponent('result', result.desktop),
		...transformThemeComponent('searchInput', searchInput.desktop),
		...transformThemeComponent('select', select.desktop),
		...transformThemeComponent('slideout', slideout.desktop),
		...transformThemeComponent('perPage', perPage.desktop),
		...transformThemeComponent('rating', rating.desktop),
		...transformThemeComponent('sortBy', sortBy.desktop),
		...transformThemeComponent('swatches', swatches.desktop),
		...transformThemeComponent('variantSelection', variantSelection.desktop),
		...transformThemeComponent('terms', terms.desktop),
	},
};
