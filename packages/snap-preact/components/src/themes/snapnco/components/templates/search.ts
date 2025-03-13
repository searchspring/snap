import { css } from '@emotion/react';
import type { SearchProps } from '../../../../components/Templates/Search';

// CSS in JS style script for the Search component
const searchStyleScript = ({ theme }: SearchProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__search__content__toolbar--middle-toolbar, .ss__search__header-section__toolbar--top-toolbar': {
			display: 'flex',
			justifyItems: 'initial',
			justifyContent: 'space-between !important',
			flexWrap: 'wrap',

			'.ss__search-header': {
				marginRight: 'auto',
			},

			'.ss__filter-summary': {
				flexBasis: '100%',
			},
		},
		'& .ss__search__content': {
			gap: '0px',
		},

		[`@media (max-width: ${variables?.breakpoints[1]}px)`]: {
			'.ss__search__content__toolbar--middle-toolbar, .ss__search__header-section__toolbar--top-toolbar': {
				'.ss__pagination-info': {
					flexBasis: '100%',
				},
				'.ss__toolbar__sort-by .ss__select__dropdown__button': {
					padding: '0px',
				},
			},
		},
		[`@media (max-width: ${variables?.breakpoints[0]}px)`]: {
			'.ss__search__header-section__toolbar--top-toolbar': {
				gap: '0px',
				'.ss__pagination-info': {
					flexBasis: 'initial',
				},
				'.ss__search-header': {
					flexBasis: '100%',
					marginBottom: '0px',
					paddingBottom: '0px',
				},
			},
		},
		[`@media (max-width: ${variables?.breakpoints[0]}px)`]: {
			'.ss__search__content__toolbar--middle-toolbar': {
				justifyContent: 'space-between',
				flexWrap: 'initial',
			},
			'.ss__toolbar__sort-by': {
				width: '49%',
				border: '1px solid #e6e6e6',
				borderRadius: '.5em',
				justifyContent: 'center',
				'.ss__dropdown': {
					width: '100%',
					'.ss__select__dropdown__button': {
						padding: '13px 15px',
						background: 'none',
						width: 'calc(100% - 30px)',
						justifyContent: 'center',
						textAlign: 'center',

						'.ss__button__content': {
							justifyContent: 'center',
						},
					},
				},
				'&:hover': {
					background: '#eeee',
				},
			},
			'.ss__toolbar__mobile-sidebar': {
				width: '49%',
				'& .ss__mobile-sidebar__slideout__button': {
					display: 'flex',
					justifyContent: 'center',
					gap: '15px',
					'.ss__button__content': {
						width: 'auto',
					},

					'&:hover': {
						background: '#eeee',
					},
				},
			},
		},
	});
};

// Search component props
export const search: ThemeComponentProps<SearchProps> = {
	default: {
		themeStyleScript: searchStyleScript,
		hideSearchHeader: true,
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
					hideFilterSummary: false,
				},
				'button.filter-toggle': {
					icon: 'close-thin',
				},

				'toolbar.top': {
					modules: [],
				},
				'toolbar.middle': {
					modules: ['SearchHeader', 'PaginationInfo', 'SortBy'],
				},
				'toolbar.bottom': {
					modules: ['Pagination'],
				},
				mobileSidebar: {
					hidePerPage: true,
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
				mobileSidebar: {
					openButtonText: 'Filters',
					hideOpenButtonText: false,
				},
				'toolbar.middle': {
					modules: ['MobileSidebar', 'SortBy'],
				},
				'toolbar.top': {
					modules: ['SearchHeader', 'PaginationInfo'],
				},
			},
		},
	},
	tablet: {
		theme: {
			components: {
				'toolbar.top': {
					modules: ['SearchHeader'],
				},
				'toolbar.middle': {
					modules: ['PaginationInfo', 'FilterSummary', 'SortBy', 'LayoutSelector'],
				},
			},
		},
	},
	desktop: {
		theme: {
			components: {},
		},
	},
};
