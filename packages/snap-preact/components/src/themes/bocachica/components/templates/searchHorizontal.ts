import { css } from '@emotion/react';
import type { SearchHorizontalProps } from '../../../../components/Templates/SearchHorizontal';

// CSS in JS style script for the SearchHorizontal component
const searchHorizontalStyleScript = ({ theme }: SearchHorizontalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		//delete me
		'.ss__banner--header': {
			display: 'none',
		},

		'.ss__filter-summary': {
			margin: '10px 0',
		},

		'.ss__search-header': {
			textAlign: 'left',
		},

		'.ss__search-horizontal__content__toolbar--top-toolbar': {
			justifyContent: 'right',

			'.ss__toolbar__pagination-info': {
				marginRight: 'auto',
			},
		},

		[`@media (max-width: ${variables?.breakpoints[2]}px)`]: {
			'.ss__search-horizontal__content__toolbar--top-toolbar': {
				justifyContent: 'space-between',
			},
		},
	});
};

// SearchHorizontal component props
export const searchHorizontal: ThemeComponentProps<SearchHorizontalProps> = {
	default: {
		themeStyleScript: searchHorizontalStyleScript,
		hideTopToolbar: false,
		hideMiddleToolbar: true,
		theme: {
			components: {
				facetsHorizontal: {
					limit: 9,
				},
				searchHeader: {
					titleText: (data) => {
						return data.search?.query?.string ? `Search Results For ${data.search?.query.string}` : 'Search Results';
					},
				},
				filterSummary: {
					hideTitle: true,
				},
				sidebar: {
					hideTitle: true,
				},
				'button.filter-toggle': {
					icon: 'filters',
				},
				'toolbar.top': {
					hideLayoutSelector: false,
					hideSortBy: false,
					hidePerPage: false,
					hideMobileSidebar: true,
					hidePaginationInfo: false,
				},
				'toolbar.bottom': {
					hidePagination: false,
					hidePaginationInfo: true,
					hideLayoutSelector: true,
					hidePerPage: true,
					hideMobileSidebar: true,
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
		hideMiddleToolbar: false,
		hideFacetsHorizontal: true,
		theme: {
			components: {
				'toolbar.top': {
					hideMobileSidebar: false,
					hidePaginationInfo: true,
				},
				'toolbar.middle': {
					hidePerPage: true,
					hideSortBy: true,
					hideMobileSidebar: true,
					hidePagination: true,
					hideLayoutSelector: true,
					hideFilterSummary: true,
					hidePaginationInfo: false,
				},
			},
		},
	},
	tablet: {},
	desktop: {},
};
