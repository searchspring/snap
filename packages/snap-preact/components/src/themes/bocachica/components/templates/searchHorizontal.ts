import { css } from '@emotion/react';
import type { SearchHorizontalProps } from '../../../../components/Templates/SearchHorizontal';

// CSS in JS style script for the SearchHorizontal component
const searchHorizontalStyleScript = () => {
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
	});
};

// SearchHorizontal component props
export const searchHorizontal: Partial<SearchHorizontalProps> = {
	themeStyleScript: searchHorizontalStyleScript,
	hideTopToolbar: false,
	hideMiddleToolbar: true,
	// lang: {
	// 	// toggleSidebarButtonText: {
	// 	// 	value: ({ filters }) => (filters.length ? `Filters (${filters.length})` : 'Filter'),
	// 	// },
	// },
	// hideSidebarToolbar: false,
	// hideTopToolbar: true,
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
				// hideToggleButton: false,
			},
			'button.filter-toggle': {
				icon: 'filters',
			},
			'toolbar.top': {
				hideLayoutSelector: false,
				hideSortBy: false,
				hidePerPage: false,
				hideMobileSidebar: true,
			},
			// 'toolbar.sidebar': {
			// 	hideMobileSidebar: false,
			// },
			// 'toolbar.middle': {
			// 	hideFilterSummary: false,

			// 	hideLayoutSelector: false,
			// 	hideSortBy: false,
			// 	hidePerPage: false,
			// },
			'toolbar.bottom': {
				hidePagination: false,
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
};
