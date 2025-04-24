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

		'.ss__search-horizontal__content__toolbar--top-toolbar, .ss__search-horizontal__content__toolbar--middle-toolbar': {
			justifyContent: 'right',

			'.ss__toolbar__pagination-info': {
				marginRight: 'auto',
			},
		},

		'.ss__search-horizontal__content__toolbar--bottom-toolbar': {
			marginTop: '10px',
		},
		[`@media (max-width: ${variables?.breakpoints[2]}px)`]: {
			'.ss__search-horizontal__content__toolbar--middle-toolbar': {
				justifyContent: 'space-between',
			},
		},
		[`@media (max-width: ${variables?.breakpoints[0]}px)`]: {
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
					hideTitleText: true,
				},
				'button.sidebar-toggle': {
					icon: 'filters',
				},
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader']],
				},
				'toolbar.middle': {
					layout: [['banner.banner'], ['paginationInfo', '_', 'sortBy', 'perPage']],
				},
				'toolbar.bottom': {
					layout: [['banner.footer'], ['pagination']],
				},
			},
		},
	},
	mobile: {
		hideFacetsHorizontal: true,

		theme: {
			components: {
				mobileSidebar: {
					openButtonText: 'Filters',
					hideOpenButtonText: false,
				},
				'toolbar.middle': {
					layout: [['mobileSidebar', '_', 'sortBy']],
				},
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader'], ['paginationInfo'], ['banner.banner']],
				},
			},
		},
	},
	tablet: {},
	desktop: {},
};
