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
					layout: [['FilterSummary'], ['Facets'], ['Banner.left']],
				},
				'button.sidebar-toggle': {
					icon: 'close-thin',
				},
				'toolbar.top': {
					layout: ['Banner.header'],
				},
				'toolbar.middle': {
					layout: [['Banner.banner'], ['SearchHeader', '_', 'PaginationInfo', 'SortBy']],
				},
				'toolbar.bottom': {
					layout: [['Banner.footer'], ['_', 'Pagination', '_']],
				},
			},
		},
	},
	mobile: {
		theme: {
			components: {
				mobileSidebar: {
					openButtonText: 'Filters',
					hideOpenButtonText: false,
				},
				'toolbar.top': {
					layout: [['Banner.header'], ['SearchHeader'], ['PaginationInfo'], ['Banner.banner']],
				},
				'toolbar.middle': {
					layout: [['MobileSidebar', '_', 'SortBy']],
				},
			},
		},
	},
	tablet: {
		theme: {
			components: {
				'toolbar.top': {
					layout: [['Banner.header'], ['SearchHeader']],
				},
				'toolbar.middle': {
					layout: [['Banner.banner'], ['PaginationInfo', '_', 'MobileSidebar'], ['FilterSummary']],
				},
				sidebar: {
					layout: [['Facets'], ['Banner.left']],
				},
			},
		},
	},
	desktop: {
		// theme: {
		// 	components: {
		// 		filterSummary: {
		// 			hideTitle: true,
		// 		},
		// 		sidebar: {
		// 			layout: [
		// 				['FilterSummary'],
		// 				['Facets'],
		// 				['Banner.left']
		// 			],
		// 		},
		// 		'button.sidebar-toggle': {
		// 			icon: 'close-thin',
		// 		},
		// 		'toolbar.top': {
		// 			layout: ['Banner.header'],
		// 		},
		// 		'toolbar.middle': {
		// 			layout: [
		// 				['Banner.banner'],
		// 				['SearchHeader', '_', 'PaginationInfo', 'SortBy']
		// 			],
		// 		},
		// 		'toolbar.bottom': {
		// 			layout: [
		// 				['Banner.footer'],
		// 				['_', 'Pagination', '_']
		// 			],
		// 		},
		// 	},
		// }
	},
};
