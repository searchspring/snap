import { SearchSnappyProps } from '../../components/Templates/SearchSnappy';
import { ThemeComponent } from '../../providers';

export const searchSnappyThemeComponentProps: ThemeComponent<'searchSnappy', SearchSnappyProps> = {
	default: {
		props: {
			layoutOptions: [
				{
					value: 1,
					label: '',
					default: true,
					icon: 'layout-large',
				},
				{
					value: 2,
					label: '',
					icon: 'layout-list',
					overrides: {
						components: {
							'*searchSnappy searchHorizontal result': {
								layout: 'list',
							},
							'*searchSnappy search result': {
								layout: 'list',
							},
							'*searchSnappy searchHorizontal results': {
								columns: 1,
							},
							'*searchSnappy search results': {
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
		components: {
			'*searchSnappy filterSummary': {
				hideTitle: true,
			},
			'*searchSnappy sidebar': {
				layout: ['facets', 'banner.left'],
			},
			'*searchSnappy button.sidebar-toggle': {
				icon: 'close-thin',
			},

			'*searchSnappy toolbar.top': {
				layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['button.sidebar-toggle', 'filterSummary', '_', 'sortBy', 'layoutSelector']],
			},
			'*searchSnappy toolbar.middle': {
				layout: [],
			},
			'*searchSnappy toolbar.bottom': {
				layout: [['banner.footer'], ['_', 'perPage', 'paginationInfo', 'pagination', '_']],
			},
			'*searchSnappy mobileSidebar filterSummary': {
				hideTitle: false,
			},
			'*searchSnappy results': {
				columns: 4,
			},
		},
	},
	mobile: {
		components: {
			'*searchSnappy results': {
				columns: 2,
			},
			'*searchSnappy toolbar.top': {
				layout: [['banner.header'], ['searchHeader', '_', 'mobileSidebar'], ['banner.banner']],
			},
			'*searchSnappy toolbar.middle': {
				layout: [['filterSummary'], ['sortBy', '_', 'layoutSelector']],
			},
		},
	},
	tablet: {
		components: {
			'*searchSnappy results': {
				columns: 3,
			},
			'*searchSnappy toolbar.top': {
				layout: [['banner.header'], ['searchHeader', '_', 'mobileSidebar'], ['banner.banner']],
			},
			'*searchSnappy toolbar.middle': {
				layout: [['filterSummary'], ['sortBy', '_', 'layoutSelector']],
			},
		},
	},
	desktop: {},
};
