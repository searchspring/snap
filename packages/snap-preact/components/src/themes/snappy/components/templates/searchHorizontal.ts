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
					layout: ['FilterSummary', 'Facets', 'Banner.left'],
				},
				'button.sidebar-toggle': {
					icon: 'filters',
				},
				'toolbar.top': {
					layout: [['Banner.header'], ['SearchHeader'], ['Banner.banner'], ['PaginationInfo', '_', 'SortBy', 'PerPage']],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: [['Banner.footer'], ['_', 'Pagination', '_']],
				},
			},
		},
	},
	mobile: {
		hideFacetsHorizontal: true,
		theme: {
			components: {
				'toolbar.top': {
					layout: [['Banner.header'], ['SearchHeader'], ['Banner.banner'], ['MobileSidebar', '_', 'LayoutSelector']],
				},
				'toolbar.middle': {
					layout: ['PaginationInfo'],
				},
			},
		},
	},
	tablet: {},
	desktop: {},
};
