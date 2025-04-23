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
					layout: [['filterSummary'], ['facets'], ['banner.left']],
				},
				'button.sidebar-toggle': {
					icon: 'close-thin',
				},
				'toolbar.top': {
					layout: ['banner.header'],
				},
				'toolbar.middle': {
					layout: [['banner.banner'], ['searchHeader', '_', 'paginationInfo', 'sortBy']],
				},
				'toolbar.bottom': {
					layout: [['banner.footer'], ['_', 'pagination', '_']],
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
					layout: [['banner.header'], ['searchHeader'], ['paginationInfo'], ['banner.banner']],
				},
				'toolbar.middle': {
					layout: [['mobileSidebar', '_', 'sortBy']],
				},
			},
		},
	},
	tablet: {
		theme: {
			components: {
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader']],
				},
				'toolbar.middle': {
					layout: [['banner.banner'], ['paginationInfo', '_', 'mobileSidebar'], ['filterSummary']],
				},
				sidebar: {
					layout: [['facets'], ['banner.left']],
				},
			},
		},
	},
	desktop: {},
};
