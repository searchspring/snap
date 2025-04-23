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
				sidebar: {
					layout: ['FilterSummary', 'Facets', 'Banner.left'],
					sticky: true,
				},
				'button.sidebar-toggle': {
					icon: 'filters',
				},
				'toolbar.top': {
					layout: [
						['_', 'SearchHeader', '_'],
						['Button.sidebar-toggle', 'PaginationInfo', '_', 'PerPage', 'SortBy'],
					],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: ['_', 'Pagination', '_'],
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
					layout: [
						['_', 'SearchHeader', '_'],
						['MobileSidebar', '_', 'PaginationInfo', '_', 'LayoutSelector'],
					],
				},
				mobileSidebar: {
					layout: [['SortBy'], ['Facets']],
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
					layout: [
						['_', 'SearchHeader', '_'],
						['MobileSidebar', '_', 'PaginationInfo', '_', 'LayoutSelector'],
					],
				},
				mobileSidebar: {
					layout: [['SortBy'], ['Facets']],
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
