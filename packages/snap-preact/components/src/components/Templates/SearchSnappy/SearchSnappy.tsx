import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const searchSnappyThemeComponentProps: ThemeComponentProps<SearchSnappyProps> = {
	default: {
		layoutOptions: [
			{
				value: 1,
				label: '',
				default: true,
				icon: 'layout-large',
			},
			{
				value: 2,
				label: '',
				icon: 'layout-list',
				overrides: {
					components: {
						'searchHorizontal result': {
							layout: 'list',
						},
						'search result': {
							layout: 'list',
						},
						'searchHorizontal results': {
							columns: 1,
						},
						'search results': {
							columns: 1,
						},
					},
				},
			},
		],
		hideToggleSidebarButton: false,
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
					layout: ['facets', 'banner.left'],
				},
				'button.sidebar-toggle': {
					icon: 'close-thin',
				},

				'toolbar.top': {
					layout: [
						['banner.header'],
						['searchHeader'],
						['banner.banner'],
						['button.sidebar-toggle', 'filterSummary', '_', 'sortBy', 'layoutSelector'],
					],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: [['banner.footer'], ['_', 'perPage', 'paginationInfo', 'pagination', '_']],
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
					layout: [['banner.header'], ['searchHeader', '_', 'mobileSidebar'], ['banner.banner']],
				},
				'toolbar.middle': {
					layout: [['filterSummary'], ['sortBy', '_', 'layoutSelector']],
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
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader', '_', 'mobileSidebar'], ['banner.banner']],
				},
				'toolbar.middle': {
					layout: [['filterSummary'], ['sortBy', '_', 'layoutSelector']],
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

export const SearchSnappy = observer((properties: SearchSnappyProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props = mergeProps('searchSnappy', globalTheme, {}, properties);

	return (
		<CacheProvider>
			<Search {...props} />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchSnappyProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
