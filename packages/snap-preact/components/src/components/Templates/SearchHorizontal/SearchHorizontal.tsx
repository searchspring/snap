import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const searchHorizontalThemeComponentProps: ThemeComponentProps<SearchHorizontalProps> = {
	default: {
		hideSidebar: true,
		theme: {
			components: {
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['paginationInfo', '_', 'sortBy', 'perPage']],
				},
				'toolbar.middle': {
					layout: ['facetsHorizontal'],
				},
				'toolbar.bottom': {
					layout: [['banner.footer'], ['_', 'pagination']],
				},
				facetsHorizontal: {
					limit: 9,
				},
			},
		},
	},
	mobile: {
		theme: {
			components: {
				'toolbar.top': {
					layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['paginationInfo', '_'], ['sortBy', '_', 'perPage']],
				},
				facetsHorizontal: {
					limit: 4,
				},
			},
		},
	},
	tablet: {
		theme: {
			components: {
				facetsHorizontal: {
					limit: 5,
				},
			},
		},
	},
	desktop: {
		theme: {
			components: {
				facetsHorizontal: {
					limit: 7,
				},
			},
		},
	},
};

export const SearchHorizontal = observer((properties: SearchHorizontalProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const props = mergeProps('searchHorizontal', globalTheme, {}, properties);

	return (
		<CacheProvider>
			<Search {...props} />
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchHorizontalProps extends SearchProps, ComponentProps {
	controller: SearchController;
}
