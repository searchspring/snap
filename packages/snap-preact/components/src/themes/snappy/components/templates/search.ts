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
					layout: ['facets', 'banner.left'],
				},
				'button.sidebar-toggle': {
					icon: 'close-thin',
				},

				'toolbar.top': {
					layout: [
						['banner.header'],
						['searchHeader'],
						['banner.banner'],
						['button.sidebar-toggle', 'filterSummary', '_', 'sortBy', 'layoutSelector'],
					],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: [['banner.footer'], ['_', 'perPage', 'paginationInfo', 'pagination', '_']],
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
					layout: [['banner.header'], ['searchHeader', '_', 'mobileSidebar'], ['banner.banner']],
				},
				'toolbar.middle': {
					layout: [['filterSummary'], ['sortBy', '_', 'layoutSelector']],
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
					layout: [['banner.header'], ['searchHeader', '_', 'mobileSidebar'], ['banner.banner']],
				},
				'toolbar.middle': {
					layout: [['filterSummary'], ['sortBy', '_', 'layoutSelector']],
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
