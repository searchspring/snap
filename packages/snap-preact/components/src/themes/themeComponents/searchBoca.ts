import { SearchBocaProps } from '../../components/Templates/SearchBoca';
import { ThemeComponent } from '../../providers';

export const searchBocaThemeComponentProps: ThemeComponent<'searchBoca', SearchBocaProps> = {
	default: {
		searchBoca: {
			layoutOptions: [
				{
					value: 1,
					label: '',
					icon: 'square',
					overrides: {
						// props: {},
						components: {
							'*searchBoca results': {
								columns: 1,
							},
						},
					},
				},
				{
					value: 2,
					label: '',
					default: true,
					icon: 'layout-large',
					overrides: {
						components: {
							'*searchBoca results': {
								columns: 2,
							},
						},
					},
				},
			],
			hideToggleSidebarButton: false,
			toggleSidebarStartClosed: true,
		},
		'searchBoca button.sidebar-toggle': {
			icon: 'filters',
		},

		'searchBoca toolbar.top': {
			layout: [
				['banner.header'],
				['_', 'searchHeader', '_'],
				['banner.banner'],
				['button.sidebar-toggle', 'paginationInfo', '_', 'perPage', 'sortBy'],
			],
		},

		'searchBoca toolbar.middle': {
			layout: [],
		},

		'searchBoca toolbar.bottom': {
			layout: [['banner.footer'], ['_', 'pagination', '_']],
		},

		'searchBoca results': {
			columns: 4,
		},
	},
	mobile: {
		'searchBoca toolbar.top': {
			layout: [['banner.header'], ['_', 'searchHeader', '_'], ['banner.banner'], ['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector']],
		},
		'searchBoca results': {
			columns: 2,
		},
	},

	tablet: {
		'searchBoca toolbar.top': {
			layout: [
				['_', 'searchHeader', '_'],
				['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector'],
			],
		},
		'searchBoca results': {
			columns: 3,
		},
	},
	desktop: {},
};
