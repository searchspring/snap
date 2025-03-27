import { css } from '@emotion/react';
import type { SearchProps } from '../../../../components/Templates/Search';

// CSS in JS style script for the Search component
const searchStyleScript = ({ theme }: SearchProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// Search component props
export const search: ThemeComponentProps<SearchProps> = {
	default: {
		themeStyleScript: searchStyleScript,
		hideToggleSidebarButton: false,
		toggleSidebarStartClosed: true,
		theme: {
			components: {
				results: {
					columns: 4,
				},
				'sidebar.search': {
					hideTitle: true,
					sticky: true,
				},
				'button.sidebar-toggle': {
					icon: 'filters',
				},
				'toolbar.top': {
					layout: [['SearchHeader'], ['toggleSideBarButton', 'PaginationInfo', 'Separator', 'PerPage', 'SortBy']],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: ['Separator', 'Pagination', 'Separator'],
				},
				mobileSidebar: {
					theme: {
						components: {
							filterSummary: {
								hideTitle: false,
							},
						},
					},
				},
			},
		},
	},
	mobile: {
		theme: {
			components: {
				results: {
					columns: 2,
				},
				'toolbar.top': {
					layout: [['SearchHeader'], ['MobileSidebar', 'Separator', 'PaginationInfo', 'Separator', 'LayoutSelector']],
				},
			},
		},
	},
	tablet: {
		theme: {
			components: {
				results: {
					columns: 3,
				},
				'toolbar.top': {
					layout: [['SearchHeader'], ['MobileSidebar', 'Separator', 'PaginationInfo', 'Separator', 'LayoutSelector']],
				},
			},
		},
	},
	desktop: {
		theme: {
			components: {
				results: {
					columns: 3,
				},
			},
		},
	},
};
