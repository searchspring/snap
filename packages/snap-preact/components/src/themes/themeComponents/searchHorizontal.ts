import { SearchHorizontalProps } from '../../components/Templates/SearchHorizontal';
import { ThemeComponent } from '../../providers';

export const searchHorizontalThemeComponentProps: ThemeComponent<'searchHorizontal', SearchHorizontalProps> = {
	default: {
		searchHorizontal: {
			hideSidebar: true,
			className: 'ss__search-horizontal',
		},
		'searchHorizontal toolbar.top': {
			layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['paginationInfo', '_', 'sortBy', 'perPage']],
		},
		'searchHorizontal toolbar.middle': {
			layout: ['facetsHorizontal'],
		},
		'searchHorizontal toolbar.bottom': {
			layout: [['banner.footer'], ['_', 'pagination']],
		},
		'searchHorizontal facetsHorizontal': {
			limit: 9,
		},
	},

	mobile: {
		'searchHorizontal toolbar.top': {
			layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['paginationInfo', '_'], ['sortBy', '_', 'perPage']],
		},
		'searchHorizontal facetsHorizontal': {
			limit: 4,
		},
	},
	tablet: {
		'searchHorizontal facetsHorizontal': {
			limit: 5,
		},
	},

	desktop: {
		'searchHorizontal facetsHorizontal': {
			limit: 7,
		},
	},
};
