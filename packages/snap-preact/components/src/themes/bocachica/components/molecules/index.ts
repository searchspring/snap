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
import { modal } from './modal';

export const molecules: ThemeResponsiveComplete = {
	default: {
		...carousel.default,
		...checkbox.default,
		...errorHandler.default,
		...facetGridOptions.default,
		...facetHierarchyOptions.default,
		...facetListOptions.default,
		...facetPaletteOptions.default,
		...facetSlider.default,
		...filter.default,
		...grid.default,
		...layoutSelector.default,
		...list.default,
		...loadMore.default,
		...overlayBadge.default,
		...pagination.default,
		...radio.default,
		...radioList.default,
		...result.default,
		...searchInput.default,
		...select.default,
		...slideout.default,
		...perPage.default,
		...rating.default,
		...sortBy.default,
		...swatches.default,
		...variantSelection.default,
		...terms.default,
		...modal.default,
	},
	mobile: {
		...carousel.mobile,
		...checkbox.mobile,
		...errorHandler.mobile,
		...facetGridOptions.mobile,
		...facetHierarchyOptions.mobile,
		...facetListOptions.mobile,
		...facetPaletteOptions.mobile,
		...facetSlider.mobile,
		...filter.mobile,
		...grid.mobile,
		...layoutSelector.mobile,
		...list.mobile,
		...loadMore.mobile,
		...overlayBadge.mobile,
		...pagination.mobile,
		...radio.mobile,
		...radioList.mobile,
		...result.mobile,
		...searchInput.mobile,
		...select.mobile,
		...slideout.mobile,
		...perPage.mobile,
		...rating.mobile,
		...sortBy.mobile,
		...swatches.mobile,
		...variantSelection.mobile,
		...terms.mobile,
		...modal.mobile,
	},
	tablet: {
		...carousel.tablet,
		...checkbox.tablet,
		...errorHandler.tablet,
		...facetGridOptions.tablet,
		...facetHierarchyOptions.tablet,
		...facetListOptions.tablet,
		...facetPaletteOptions.tablet,
		...facetSlider.tablet,
		...filter.tablet,
		...grid.tablet,
		...layoutSelector.tablet,
		...list.tablet,
		...loadMore.tablet,
		...overlayBadge.tablet,
		...pagination.tablet,
		...radio.tablet,
		...radioList.tablet,
		...result.tablet,
		...searchInput.tablet,
		...select.tablet,
		...slideout.tablet,
		...perPage.tablet,
		...rating.tablet,
		...sortBy.tablet,
		...swatches.tablet,
		...variantSelection.tablet,
		...terms.tablet,
		...modal.tablet,
	},
	desktop: {
		...carousel.desktop,
		...checkbox.desktop,
		...errorHandler.desktop,
		...facetGridOptions.desktop,
		...facetHierarchyOptions.desktop,
		...facetListOptions.desktop,
		...facetPaletteOptions.desktop,
		...facetSlider.desktop,
		...filter.desktop,
		...grid.desktop,
		...layoutSelector.desktop,
		...list.desktop,
		...loadMore.desktop,
		...overlayBadge.desktop,
		...pagination.desktop,
		...radio.desktop,
		...radioList.desktop,
		...result.desktop,
		...searchInput.desktop,
		...select.desktop,
		...slideout.desktop,
		...perPage.desktop,
		...rating.desktop,
		...sortBy.desktop,
		...swatches.desktop,
		...variantSelection.desktop,
		...terms.desktop,
		...modal.desktop,
	},
};
