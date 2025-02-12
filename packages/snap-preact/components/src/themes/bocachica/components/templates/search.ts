import { css } from '@emotion/react';
import type { SearchProps } from '../../../../components/Templates/Search';

// CSS in JS style script for the Search component
const searchStyleScript = () => {
	return css({
		'.ss__search__content__toolbar--middle-toolbar, .ss__search__header-section__toolbar--top-toolbar': {
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
export const search: ThemeComponentProps<SearchProps> = {
	default: {
		themeStyleScript: searchStyleScript,
		hideToggleSidebarButton: false,
		hideTopToolbar: false,
		hideMiddleToolbar: true,
		lang: {
			// toggleSidebarButtonText: {
			// 	value: ({ filters }) => (filters.length ? `Filters (${filters.length})` : 'Filter'),
			// },
		},
		// hideSidebarToolbar: false,
		// hideTopToolbar: true,

		theme: {
			// responsive: [],
			components: {
				// searchHeader: {
				// 	titleText: (data) => {
				// 		return data.search?.query?.string ? `Search Results For ${data.search?.query.string}` : 'Search Results';
				// 	},
				// },
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
	},
	mobile: {
		theme: {
			components: {
				results: {
					columns: 2,
				},
				'toolbar.top': {
					hideMobileSidebar: false,
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
