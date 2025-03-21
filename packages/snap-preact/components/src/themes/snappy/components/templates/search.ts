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
				// facetPaletteOptions: {
				// 	hideLabel: false,
				// 	columns: 3,
				// },

				filterSummary: {
					hideTitle: true,
				},
				sidebar: {
					hideTitle: true,
					hideFilterSummary: true,
				},
				'button.sidebar-toggle': {
					icon: 'close-thin',
				},

				'toolbar.top': {
					layout: [['SearchHeader'], ['Slot0', 'FilterSummary', 'Separator', 'SortBy', 'LayoutSelector']],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: ['Separator', 'PerPage', 'PaginationInfo', 'Pagination', 'Separator'],
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
					layout: ['SearchHeader', 'Separator', 'MobileSidebar'],
				},
				'toolbar.middle': {
					layout: [['FilterSummary'], ['SortBy', 'Separator', 'LayoutSelector']],
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
					layout: ['SearchHeader', 'Separator', 'MobileSidebar'],
				},
				'toolbar.middle': {
					layout: [['FilterSummary'], ['SortBy', 'Separator', 'LayoutSelector']],
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
