import { css } from '@emotion/react';
import type { SearchProps } from '../../../../components/Templates/Search';

// CSS in JS style script for the Search component
const searchStyleScript = ({ theme }: SearchProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__search__content__toolbar--middle-toolbar, .ss__search__header-section__toolbar--top-toolbar': {
			display: 'flex',
			justifyContent: 'initial',
			justifyItems: 'initial',

			'.ss__toolbar__sort-by': {
				marginLeft: 'auto',
			},
			'.ss__dropdown .ss__select__dropdown__button': {
				padding: '6px 5px 6px 5px',
			},
		},

		[`@media (max-width: ${variables?.breakpoints[0]}px)`]: {
			'.ss__search__header-section__toolbar--top-toolbar': {
				justifyContent: 'space-between !important',
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
		hideMiddleToolbar: false,
		lang: {
			// toggleSidebarButtonText: {
			// 	value: ({ filters }) => (filters.length ? `Filters (${filters.length})` : 'Filter'),
			// },
		},
		theme: {
			components: {
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
					modules: ['PaginationInfo', 'SortBy', 'PerPage'],
				},
				'toolbar.middle': {
					modules: [],
				},
				'toolbar.bottom': {
					modules: ['Pagination'],
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
					modules: ['MobileSidebar', 'LayoutSelector'],
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
