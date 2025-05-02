import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const searchBocaThemeComponentProps: ThemeComponentProps<SearchBocaProps> = {
	default: {
		/*
			can i set overrides for the searchtemplate in here?
		*/
		layoutOptions: [
			{
				value: 1,
				label: '',
				icon: 'square',
				overrides: {
					components: {
						'searchHorizontal results': {
							columns: 1,
						},
						'search results': {
							columns: 1,
						},
					},
				},
			},
			{
				value: 2,
				label: '',
				default: true,
				icon: 'layout-large',
				overrides: {
					components: {
						'searchHorizontal results': {
							columns: 2,
						},
						'search results': {
							columns: 2,
						},
					},
				},
			},
		],
		hideToggleSidebarButton: false,
		toggleSidebarStartClosed: true,
		theme: {
			components: {
				results: {
					columns: 4,
				},
				sidebar: {
					layout: ['filterSummary', 'facets', 'banner.left'],
					sticky: true,
				},
				'button.sidebar-toggle': {
					icon: 'filters',
				},
				'toolbar.top': {
					layout: [
						['banner.header'],
						['_', 'searchHeader', '_'],
						['banner.banner'],
						['button.sidebar-toggle', 'paginationInfo', '_', 'perPage', 'sortBy'],
					],
				},
				'toolbar.middle': {
					layout: [],
				},
				'toolbar.bottom': {
					layout: [['banner.footer'], ['_', 'pagination', '_']],
				},
			},
		},
	},
	mobile: {
		theme: {
			components: {
				results: {
					columns: 5,
				},
				'toolbar.top': {
					layout: [['banner.header'], ['_', 'searchHeader', '_'], ['banner.banner'], ['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector']],
				},
				mobileSidebar: {
					layout: [['sortBy'], ['facets']],
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
					layout: [
						['_', 'searchHeader', '_'],
						['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector'],
					],
				},
				mobileSidebar: {
					layout: [['sortBy'], ['facets'], ['banner.left']],
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

export const SearchBoca = observer((properties: SearchBocaProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const props = mergeProps('searchBoca', globalTheme, {}, properties);

	return (
		<CacheProvider>
			<Search {...props} />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchBocaProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
