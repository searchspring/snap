import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider, ThemeComponent } from '../../../providers';
import { Search, SearchProps } from '../Search/Search';

/*

	type ThemeComponentProps<ComponentName, ComponentProps> = {
		default?: {
			props?: ComponentProps,
			components?: ThemeTemplate<ComponentName>,
		},
		mobile?: {
			props?: ComponentProps,
			components?: ThemeTemplate<ComponentName>,
		},
		tablet?: {
			props?: ComponentProps,
			components?: ThemeTemplate<ComponentName>,
		},
		desktop?: {
			props?: ComponentProps,
			components?: ThemeTemplate<ComponentName>,
		}
	}

	export const searchBocaThemeComponentProps: ThemeComponentProps<'searchBoca', SearchBocaProps> = {
		...
	}


	// alternative:

	export const searchBocaThemeComponentProps: ThemeComponent<'searchBoca', SearchBocaProps> = {
		default: {
			'*searchBoca': {
				layoutOptions: [
					{
						value: 1,
						label: '',
						icon: 'square',
						overrides: {
							// props: {},
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
			},
			'*searchBoca toolbar.top': {
				layout: [
					['banner.header'],
					['_', 'searchHeader', '_'],
					['banner.banner'],
					['button.sidebar-toggle', 'paginationInfo', '_', 'perPage', 'sortBy'],
				],
			},

			'*searchBoca toolbar.middle': {
				layout: [],
			},

			'*searchBoca toolbar.bottom': {
				layout: [['banner.footer'], ['_', 'pagination', '_']],
			},
		},
		mobile: {
			'*searchBoca toolbar.top': {
				layout: [['banner.header'], ['_', 'searchHeader', '_'], ['banner.banner'], ['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector']],
			},
		},
		tablet: {
			'*searchBoca toolbar.top': {
				layout: [
					['_', 'searchHeader', '_'],
					['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector'],
				],
			},
		},
		desktop: {},
	};


*/

export const searchBocaThemeComponentProps: ThemeComponent<'searchBoca', SearchBocaProps> = {
	default: {
		props: {
			layoutOptions: [
				{
					value: 1,
					label: '',
					icon: 'square',
					overrides: {
						// props: {},
						components: {
							'*searchBoca results': {
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
							'*searchBoca results': {
								columns: 2,
							},
						},
					},
				},
			],
			hideToggleSidebarButton: false,
			toggleSidebarStartClosed: true,
		},
		components: {
			'*searchBoca toolbar.top': {
				layout: [
					['banner.header'],
					['_', 'searchHeader', '_'],
					['banner.banner'],
					['button.sidebar-toggle', 'paginationInfo', '_', 'perPage', 'sortBy'],
				],
			},

			'*searchBoca toolbar.middle': {
				layout: [],
			},

			'*searchBoca toolbar.bottom': {
				layout: [['banner.footer'], ['_', 'pagination', '_']],
			},

			'*searchBoca results': {
				columns: 4,
			},
		},
	},
	mobile: {
		components: {
			'*searchBoca toolbar.top': {
				layout: [['banner.header'], ['_', 'searchHeader', '_'], ['banner.banner'], ['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector']],
			},
			'*searchBoca results': {
				columns: 2,
			},
		},
	},
	tablet: {
		components: {
			'*searchBoca toolbar.top': {
				layout: [
					['_', 'searchHeader', '_'],
					['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector'],
				],
			},
			'*searchBoca results': {
				columns: 3,
			},
		},
	},
	desktop: {},
};

/*

// theme getter from ThemeStore - passed down via TemplateSelect or useTheme
globalTheme is theme definitions from theme files AND user theme overrides

globalTheme = {
	variables,
	components: {
		// theme definitions
		...
		'toolbar': { ... },
		...
		'seachBoca toolbar.top': { ... }

		// user theme overrides
		'toolbar.top': { ... }
	}
	responsive: {}
}

mergeProps (componentType, globalTheme, defaultProps, props) => {
	// componentType = 'toolbar'

	globalThemeProps for 'toolbar' (applicable selectors found from filterSelectors function)
	// apply props from applicable selectors (these are sorted by specificity)

	merge props from theme prop (of which there will be few of these, eg. facets)
}

*/

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
