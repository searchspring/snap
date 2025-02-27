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
		},

		[`@media (max-width: ${variables?.breakpoints[0]}px)`]: {
			position: 'relative',
			'.ss__search__header-section__toolbar--top-toolbar': {
				justifyContent: 'flex-end !important',
				position: 'absolute',
				top: '0px',
				right: '0px',
			},
			'.ss__search__content__toolbar--middle-toolbar': {
				justifyContent: 'space-between !important',
				flexWrap: 'wrap',
				'.ss__toolbar__filter-summary': {
					flexBasis: '100%',
				},
			},
			'.ss__search__content__toolbar--middle-toolbar, .ss__search__header-section__toolbar--top-toolbar': {
				'.ss__toolbar__sort-by': {
					marginLeft: 'initial',
				},
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
				'button.filter-toggle': {
					icon: 'close-thin',
				},

				'toolbar.top': {
					modules: ['FilterSummary', 'SortBy', 'LayoutSelector'],
				},
				'toolbar.middle': {
					modules: [],
				},
				'toolbar.bottom': {
					modules: ['PerPage', 'PaginationInfo', 'Pagination'],
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
					modules: ['MobileSidebar'],
				},
				'toolbar.middle': {
					modules: ['FilterSummary', 'SortBy', 'LayoutSelector'],
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
