import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider, ThemeTemplate } from '../../../providers';
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

*/

export const searchBocaThemeComponentProps: ThemeTemplate<'searchBoca', SearchBocaProps> = {
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
		},
	},
	mobile: {
		components: {
			'*searchBoca toolbar.top': {
				layout: [['banner.header'], ['_', 'searchHeader', '_'], ['banner.banner'], ['mobileSidebar', '_', 'paginationInfo', '_', 'layoutSelector']],
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

export const searchBocaThemeComponentProps2: ThemeComponentProps<SearchBocaProps> = {
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
				pagination: {
					hideFirst: true,
					hideLast: true,
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
