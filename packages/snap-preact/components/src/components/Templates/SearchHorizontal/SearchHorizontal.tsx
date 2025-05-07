import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider, ThemeComponent } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

export const searchHorizontalThemeComponentProps: ThemeComponent<'searchHorizontal', SearchHorizontalProps> = {
	default: {
		props: {
			hideSidebar: true,
		},
		components: {
			'*searchHorizontal toolbar.top': {
				layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['paginationInfo', '_', 'sortBy', 'perPage']],
			},
			'*searchHorizontal toolbar.middle': {
				layout: ['facetsHorizontal'],
			},
			'*searchHorizontal toolbar.bottom': {
				layout: [['banner.footer'], ['_', 'pagination']],
			},
			'*searchHorizontal facetsHorizontal': {
				limit: 9,
			},
		},
	},
	mobile: {
		components: {
			'*searchHorizontal toolbar.top': {
				layout: [['banner.header'], ['searchHeader'], ['banner.banner'], ['filterSummary'], ['paginationInfo', '_'], ['sortBy', '_', 'perPage']],
			},
			'*searchHorizontal facetsHorizontal': {
				limit: 4,
			},
		},
	},
	tablet: {
		components: {
			'*searchHorizontal facetsHorizontal': {
				limit: 5,
			},
		},
	},
	desktop: {
		components: {
			'*searchHorizontal facetsHorizontal': {
				limit: 7,
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
