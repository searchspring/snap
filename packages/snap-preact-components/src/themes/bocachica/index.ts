import { Theme, ThemeVariables } from '../../providers';
import * as style from './styles/styles';

const bocachicaVariables: ThemeVariables = {
	breakpoints: [0, 540, 767, 1024],
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
	components: {
		// component theme prop overrides
		// ATOMS
		badge: {
			...style.components.badge,
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
		filter: {
			...style.components.filter,
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
		autocomplete: {
			...style.components.autocomplete,
		},
		branchOverride: {
			...style.components.branchOverride,
		},
		facet: {
			...style.components.facet,
		},
		facets: {
			...style.components.facets,
		},
		filterSummary: {
			...style.components.filterSummary,
		},
		recommendation: {
			...style.components.recommendation,
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
	},
	responsive: [
		{
			components: {
				results: {
					columns: 2,
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
							facets: {
								limit: 3,
							},
							facet: {
								limit: 3,
							},
						},
					},
				},
			},
		},
		{
			components: {
				results: {
					columns: 3,
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
								limit: 3,
								style: {
									// horizontal facets
									width: '100%',
									display: 'flex',
								},
							},
							facet: {
								limit: 4,
								disableCollapse: true,
								disableOverflow: true,
							},
							image: {
								lazy: false,
							},
						},
					},
				},
			},
		},
		{
			components: {
				results: {
					columns: 4,
				},
				autocomplete: {
					theme: {
						components: {
							results: {
								rows: 2,
								columns: 3,
							},
							facets: {
								limit: 3,
							},
							facet: {
								limit: 5,
								disableCollapse: true,
								disableOverflow: true,
							},
							image: {
								lazy: false,
							},
						},
					},
				},
			},
		},
	],
};
