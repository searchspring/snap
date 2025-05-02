import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const searchSnapncoThemeComponentProps: ThemeComponentProps<SearchSnapncoProps> = {
	default: {
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
					layout: [['filterSummary'], ['facets'], ['banner.left']],
				},
				'button.sidebar-toggle': {
					icon: 'close-thin',
				},
				'toolbar.top': {
					layout: ['banner.header'],
				},
				'toolbar.middle': {
					layout: [['banner.banner'], ['searchHeader', '_', 'paginationInfo', 'sortBy']],
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
				mobileSidebar: {
					openButtonText: 'Filters',
					hideOpenButtonText: false,
				},
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader'], ['paginationInfo'], ['banner.banner']],
				},
				'toolbar.middle': {
					layout: [['mobileSidebar', '_', 'sortBy']],
				},
			},
		},
	},
	tablet: {
		theme: {
			components: {
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader']],
				},
				'toolbar.middle': {
					layout: [['banner.banner'], ['paginationInfo', '_', 'mobileSidebar'], ['filterSummary']],
				},
				sidebar: {
					layout: [['facets'], ['banner.left']],
				},
			},
		},
	},
	desktop: {},
};

export const SearchSnapnco = observer((properties: SearchSnapncoProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props = mergeProps('searchSnapnco', globalTheme, {}, properties);

	return (
		<CacheProvider>
			<Search {...props} />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchSnapncoProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
