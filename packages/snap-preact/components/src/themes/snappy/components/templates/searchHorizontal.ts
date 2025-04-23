import { css } from '@emotion/react';
import type { SearchHorizontalProps } from '../../../../components/Templates/SearchHorizontal';

// CSS in JS style script for the SearchHorizontal component
const searchHorizontalStyleScript = ({ theme }: SearchHorizontalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__filter-summary': {
			margin: '10px 0',
		},

		'.ss__search-header': {
			textAlign: 'left',
		},

		'.ss__search-horizontal__content__toolbar--bottom-toolbar': {
			marginTop: '10px',
		},
	});
};

// SearchHorizontal component props
export const searchHorizontal: ThemeComponentProps<SearchHorizontalProps> = {
	default: {
		themeStyleScript: searchHorizontalStyleScript,
		theme: {
			components: {
				searchHeader: {
					titleText: (data) => {
						return data.search?.query?.string ? `Search Results For ${data.search?.query.string}` : 'Search Results';
					},
				},
				filterSummary: {
					hideTitle: true,
				},
				sidebar: {
					layout: ['filterSummary', 'facets', 'banner.left'],
				},
				'button.sidebar-toggle': {
					icon: 'filters',
				},
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['paginationInfo', '_', 'sortBy', 'perPage']],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: [['banner.footer'], ['_', 'pagination', '_']],
				},
			},
		},
	},
	mobile: {
		hideFacetsHorizontal: true,
		theme: {
			components: {
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['mobileSidebar', '_', 'layoutSelector']],
				},
				'toolbar.middle': {
					layout: ['paginationInfo'],
				},
			},
		},
	},
	tablet: {},
	desktop: {},
};
