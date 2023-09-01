import { Theme } from '../../providers';
import * as style from './styles/styles';

type GlobalThemeVariables = {
	color?: {
		primary?: string; // (search header text, regular text, result title)
		secondary?: string; // (headings, dropdown button text)
		accent?: string; // (icons, borders)
		active?: {
			foreground?: string; // (active state text)
			background?: string; // (active state)
			accent?: string; // (icons, borders)
		};
		hover?: {
			foreground?: string; // (active state text)
			background?: string; // (active state)
			accent?: string; // (icons, borders)
		};
	};
};

export type BocachicaVariables = GlobalThemeVariables & {
	breakpoints?: [number, number, number, number];
};

export type BocachicaTheme = Theme & {
	variables: BocachicaVariables;
	responsive: [Theme, Theme, Theme, Theme];
};

const bocachicaVariables: BocachicaVariables = {
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

export const bocachica: BocachicaTheme = {
	variables: bocachicaVariables,
	components: {
		// ATOMS
		badge: {
			...style.components.badge,
			// component theme prop overrides
		},
		breadcrumbs: {
			...style.components.button,
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
		loadingBar: {
			...style.components.loadingBar,
		},
		banner: {
			...style.components.banner,
		},
		inlineBanner: {
			...style.components.inlineBanner,
		},
		overlay: {
			...style.components.overlay,
		},
		price: {
			...style.components.price,
		},
		skeleton: {
			...style.components.skeleton,
		},
		element: {
			...style.components.element,
		},
		searchHeader: {
			...style.components.searchHeader,
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
		pagination: {
			...style.components.pagination,
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
		perPage: {
			...style.components.perPage,
		},
		rating: {
			...style.components.rating,
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
		noResults: {
			...style.components.noResults,
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
