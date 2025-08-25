import { SearchSnappyProps } from '../../components/Templates/SearchSnappy';
import { ThemeComponent } from '../../providers';

export const searchSnappyThemeComponentProps: ThemeComponent<'searchSnappy', SearchSnappyProps> = {
	default: {
		searchSnappy: {
			layoutOptions: [
				{
					value: 1,
					label: 'Grid',
					default: true,
					icon: 'layout-large',
				},
				{
					value: 2,
					label: 'List',
					icon: 'layout-list',
					overrides: {
						components: {
							'searchSnappy result': {
								layout: 'list',
							},
							'searchSnappy results': {
								columns: 1,
							},
						},
					},
				},
			],
			hideToggleSidebarButton: false,
			lang: {
				toggleSidebarButtonText: {
					value: ({ sidebarOpenState }) => (sidebarOpenState ? `Close Filters` : 'Show Filters'),
				},
			},
		},

		'searchSnappy filterSummary': {
			hideTitle: true,
		},
		'searchSnappy sidebar': {
			layout: ['facets', 'banner.left'],
		},
		'searchSnappy button.sidebar-toggle': {
			icon: 'close-thin',
		},

		'searchSnappy toolbar.top': {
			layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['button.sidebar-toggle', 'filterSummary', '_', 'sortBy', 'layoutSelector']],
		},
		'searchSnappy toolbar.middle': {
			layout: [],
		},
		'searchSnappy toolbar.bottom': {
			layout: [['banner.footer'], ['_', 'perPage', 'paginationInfo', 'pagination', '_']],
		},
		'searchSnappy mobileSidebar filterSummary': {
			hideTitle: false,
		},
		'searchSnappy results': {
			columns: 4,
		},
	},
	mobile: {
		'searchSnappy results': {
			columns: 2,
		},
		'searchSnappy toolbar.top': {
			layout: [['banner.header'], ['searchHeader', '_', 'mobileSidebar'], ['banner.banner']],
		},
		'searchSnappy toolbar.middle': {
			layout: [['filterSummary'], ['sortBy', '_', 'layoutSelector']],
		},
	},
	tablet: {
		'searchSnappy results': {
			columns: 3,
		},
		'searchSnappy toolbar.top': {
			layout: [['banner.header'], ['searchHeader', '_', 'mobileSidebar'], ['banner.banner']],
		},
		'searchSnappy toolbar.middle': {
			layout: [['filterSummary'], ['sortBy', '_', 'layoutSelector']],
		},
	},
	desktop: {},
};
