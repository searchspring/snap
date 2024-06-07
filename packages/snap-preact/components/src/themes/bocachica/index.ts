import { Theme, ThemeVariables } from '../../providers';
import * as style from './styles/styles';

const bocachicaVariables: ThemeVariables = {
	breakpoints: [0, 767, 999, 1299],
	color: {
		primary: '#202223',
		secondary: '#6d7175',
		accent: '#6d7175',
		active: {
			foreground: '#ffffff',
			background: '#6d7175',
			accent: '#ffffff',
		},
		hover: {
			foreground: '#ffffff',
			background: '#000000',
			accent: '#ffffff',
		},
	},
};

export const bocachica: Theme = {
	name: 'bocachica',
	variables: bocachicaVariables,
	layoutOptions: [
		{
			value: 1,
			icon: 'square',
			overrides: {
				components: {
					results: {
						named: {
							searchResults: { columns: 1 },
						},
					},
				},
			},
		},
		{
			value: 2,
			default: true,
			icon: 'layout-large',
			overrides: {
				components: {
					results: {
						named: {
							searchResults: { columns: 2 },
						},
					},
				},
			},
		},
	],
	components: {
		// component theme prop overrides
		// ATOMS
		badgeImage: {
			...style.components.badgeImage,
		},
		badgePill: {
			...style.components.badgePill,
		},
		badgeRectangle: {
			...style.components.badgeRectangle,
		},
		badgeText: {
			...style.components.badgeText,
		},
		banner: {
			...style.components.banner,
		},
		breadcrumbs: {
			...style.components.breadcrumbs,
		},
		button: {
			...style.components.button,
		},
		dropdown: {
			...style.components.dropdown,
		},
		formattedNumber: {
			...style.components.formattedNumber,
		},
		icon: {
			...style.components.icon,
		},
		image: {
			...style.components.image,
		},
		inlineBanner: {
			...style.components.inlineBanner,
		},
		loadingBar: {
			...style.components.loadingBar,
		},
		noResults: {
			...style.components.noResults,
		},
		overlay: {
			...style.components.overlay,
		},
		price: {
			...style.components.price,
		},
		searchHeader: {
			...style.components.searchHeader,
		},
		skeleton: {
			...style.components.skeleton,
		},
		terms: {
			...style.components.terms,
		},
		toggle: {
			...style.components.toggle,
		},
		// MOLECULES
		carousel: {
			...style.components.carousel,
		},
		checkbox: {
			...style.components.checkbox,
		},
		errorHandler: {
			...style.components.errorHandler,
		},
		facetGridOptions: {
			...style.components.facetGridOptions,
		},
		facetHierarchyOptions: {
			...style.components.facetHierarchyOptions,
		},
		facetListOptions: {
			...style.components.facetListOptions,
		},
		facetPaletteOptions: {
			...style.components.facetPaletteOptions,
		},
		facetSlider: {
			...style.components.facetSlider,
		},
		facetToggle: {
			...style.components.facetToggle,
		},
		filter: {
			...style.components.filter,
		},
		layoutSelector: {
			...style.components.layoutSelector,
		},
		list: {
			...style.components.list,
		},
		loadMore: {
			...style.components.loadMore,
		},
		pagination: {
			...style.components.pagination,
		},
		perPage: {
			...style.components.perPage,
		},
		radio: {
			...style.components.radio,
		},
		radioList: {
			...style.components.radioList,
		},
		rating: {
			...style.components.rating,
		},
		result: {
			...style.components.result,
		},
		searchInput: {
			...style.components.searchInput,
		},
		select: {
			...style.components.select,
		},
		slideout: {
			...style.components.slideout,
		},
		sortBy: {
			...style.components.sortBy,
		},
		// ORGANISMS
		branchOverride: {
			...style.components.branchOverride,
		},
		facet: {
			...style.components.facet,
		},
		facets: {
			...style.components.facets,
		},
		horizontalFacets: {
			...style.components.horizontalFacets,
		},
		filterSummary: {
			...style.components.filterSummary,
		},
		mobileSidebar: {
			...style.components.mobileSidebar,
		},
		results: {
			...style.components.results,
		},
		sidebar: {
			...style.components.sidebar,
		},
		toolbar: {
			...style.components.toolbar,
		},
		// TEMPLATES
		autocomplete: {
			...style.components.autocomplete,
		},
		recommendation: {
			...style.components.recommendation,
		},
		search: {
			...style.components.search,
		},
		horizontalSearch: {
			...style.components.horizontalSearch,
		},
	},
	responsive: [
		{
			components: {
				results: {
					columns: 2,
				},
				toolbar: {
					named: {
						topToolBar: {
							hidePagination: true,
							hideSortBy: true,
							hidePerPage: true,
						},
					},
				},
				autocomplete: {
					hideFacets: true,
					vertical: true,
					horizontalTerms: true,
					theme: {
						components: {
							results: {
								rows: 1,
								columns: 2,
							},
						},
					},
				},
			},
		},
		{
			components: {
				results: {
					columns: 2,
				},
				toolbar: {
					named: {
						topToolBar: {
							hidePagination: true,
						},
					},
				},
				autocomplete: {
					hideFacets: true,
					vertical: true,
					horizontalTerms: true,
					theme: {
						components: {
							results: {
								rows: 1,
								columns: 3,
							},
						},
					},
				},
			},
		},
		{
			layoutOptions: [],
			components: {
				results: {
					columns: 3,
				},
				toolbar: {
					named: {
						topToolBar: {
							hidePagination: true,
						},
					},
				},
				autocomplete: {
					vertical: true,
					horizontalTerms: true,
					theme: {
						components: {
							results: {
								rows: 1,
								columns: 4,
							},
							facets: {
								style: {
									// horizontal facets
									width: '100%',
									display: 'flex',
								},
							},
							facet: {
								limit: 4,
							},
						},
					},
				},
			},
		},
		{
			layoutOptions: [],
			components: {
				results: {
					columns: 4,
				},
				toolbar: {
					named: {
						topToolBar: {
							hidePagination: true,
						},
					},
				},
				autocomplete: {
					theme: {
						components: {
							results: {
								rows: 2,
								columns: 3,
							},
						},
					},
				},
			},
		},
	],
};
