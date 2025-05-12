import { SearchHorizontalProps } from '../../components/Templates/SearchHorizontal';

export const searchHorizontalThemeComponentProps: ThemeComponent<'searchHorizontal', SearchHorizontalProps> = {
	default: {
		props: {
			hideSidebar: true,
			className: 'ss__search-horizontal',
		},
		components: {
			'*searchHorizontal toolbar.top': {
				layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['paginationInfo', '_', 'sortBy', 'perPage']],
			},
			'*searchHorizontal toolbar.middle': {
				layout: ['facetsHorizontal'],
			},
			'*searchHorizontal toolbar.bottom': {
				layout: [['banner.footer'], ['_', 'pagination']],
			},
			'*searchHorizontal facetsHorizontal': {
				limit: 9,
			},
		},
	},
	mobile: {
		components: {
			'*searchHorizontal toolbar.top': {
				layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['paginationInfo', '_'], ['sortBy', '_', 'perPage']],
			},
			'*searchHorizontal facetsHorizontal': {
				limit: 4,
			},
		},
	},
	tablet: {
		components: {
			'*searchHorizontal facetsHorizontal': {
				limit: 5,
			},
		},
	},
	desktop: {
		components: {
			'*searchHorizontal facetsHorizontal': {
				limit: 7,
			},
		},
	},
};
