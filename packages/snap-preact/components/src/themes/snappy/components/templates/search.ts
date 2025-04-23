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
		lang: {
			toggleSidebarButtonText: {
				value: ({ sidebarOpenState }) => (sidebarOpenState ? `Close Filters` : 'Show Filters'),
			},
		},
		theme: {
			components: {
				filterSummary: {
					hideTitle: true,
				},
				sidebar: {
					layout: ['Facets', 'Banner.left'],
				},
				'button.sidebar-toggle': {
					icon: 'close-thin',
				},

				'toolbar.top': {
					layout: [
						['Banner.header'],
						['SearchHeader'],
						['Banner.banner'],
						['Button.sidebar-toggle', 'FilterSummary', '_', 'SortBy', 'LayoutSelector'],
					],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: [['Banner.footer'], ['_', 'PerPage', 'PaginationInfo', 'Pagination', '_']],
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
					layout: [['Banner.header'], ['SearchHeader', '_', 'MobileSidebar'], ['Banner.banner']],
				},
				'toolbar.middle': {
					layout: [['FilterSummary'], ['SortBy', '_', 'LayoutSelector']],
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
					layout: [['Banner.header'], ['SearchHeader', '_', 'MobileSidebar'], ['Banner.banner']],
				},
				'toolbar.middle': {
					layout: [['FilterSummary'], ['SortBy', '_', 'LayoutSelector']],
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
