import { Theme, ThemeVariables } from '../../providers';
import * as style from './styles/styles';

const bocachicaVariables: ThemeVariables = {
	breakpoints: [0, 540, 767, 1200],
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
	variables: bocachicaVariables,
	components: {
		// ATOMS
		badge: {
			...style.components.badge,
			// component theme prop overrides
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
	responsive: [{}, {}, {}, {}],
};
