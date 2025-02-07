import { css } from '@emotion/react';
import type { SearchProps } from '../../../../components/Templates/Search';

// CSS in JS style script for the Search component
const searchStyleScript = () => {
	return css({
		'.ss__sidebar': {
			margin: '0 40px 0 0',
		},

		'.ss__search__content__toolbar--middle-toolbar': {
			display: 'flex',
			justifyContent: 'initial',
			justifyItems: 'initial',

			'.ss__toolbar__sort-by': {
				marginLeft: 'auto',
			},
			'.ss__select__dropdown__button': {
				padding: '6px 5px 6px 30px',
			},
		},
	});
};

// Search component props
export const search: Partial<SearchProps> = {
	themeStyleScript: searchStyleScript,
	hideToggleSidebarButton: true,
	hideTopToolbar: true,
	lang: {
		// toggleSidebarButtonText: {
		// 	value: ({ filters }) => (filters.length ? `Filters (${filters.length})` : 'Filter'),
		// },
	},
	// hideSidebarToolbar: false,
	// hideTopToolbar: true,
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
				hideTitle: true,
				hideToggleButton: false,
			},
			'button.filter-toggle': {
				icon: 'filters',
			},
			// 'toolbar.top': {
			// 	hideLayoutSelector: false,
			// 	hideSortBy: false,
			// 	hidePerPage: false,
			// },
			// 'toolbar.sidebar': {
			// 	hideMobileSidebar: false,
			// },
			'toolbar.middle': {
				hideFilterSummary: false,

				hideLayoutSelector: false,
				hideSortBy: false,
				hidePerPage: false,
			},
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
