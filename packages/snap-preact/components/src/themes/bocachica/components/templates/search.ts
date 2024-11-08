import { css } from '@emotion/react';
import type { SearchProps } from '../../../../components/Templates/Search';

// CSS in JS style script for the Search component
const searchStyleScript = ({ theme }: SearchProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__search__header-section': {},

		'.ss__search__content-section': {
			display: 'flex',
			minHeight: '600px',
		},

		'.ss__search__header-section__toolbar--top-toolbar': {
			justifyContent: 'flex-end',
		},

		'.ss__search__content__toolbar--middle-toolbar': {
			justifyContent: 'flex-start',
		},

		'.ss__sidebar': {
			flex: '0 1 auto',
			width: '270px',
			margin: '0 40px 0 0',
		},

		'.ss__search__content': {
			width: '100%',
			boxSizing: 'border-box',
		},
	});
};

// Search component props
export const search: Partial<SearchProps> = {
	themeStyleScript: searchStyleScript,
	hideToggleSidebarButton: false,
	lang: {
		toggleSidebarButtonText: {
			value: ({ filters }) => (filters.length ? `Filters (${filters.length})` : 'Filter'),
		},
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
				hideLayoutSelector: false,
				hideSortBy: false,
				hidePerPage: false,
			},
			'toolbar.middle': {
				hideFilterSummary: false,
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
