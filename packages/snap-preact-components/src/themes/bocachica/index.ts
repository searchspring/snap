import { Theme } from '../../providers';
import * as style from './styles/styles';

type GlobalThemeVariables = {
	color?: {
		text?: string;
		background?: string;
		primary?: string;
		primaryBgText?: string;
		secondary?: string;
		hover?: {
			background: string;
			text: string;
		};
		message?: {
			error?: string;
			warning?: string;
			info?: string;
		};
	};
};

export type BocachicaVariables = GlobalThemeVariables & {
	breakpoints?: [number, number, number, number];
	filterSummary?: GlobalThemeVariables;
};

export type BocachicaTheme = Theme & {
	variables: BocachicaVariables;
	responsive: [Theme, Theme, Theme, Theme];
};

const bocachicaVariables: BocachicaVariables = {
	breakpoints: [0, 540, 767, 1200],
	color: {
		text: '#515151',
		background: '',
		primary: '#3A23AD',
		primaryBgText: 'white',
		secondary: '#8F6CF6',
		hover: {
			text: 'black',
			background: '#eeeeee',
		},
		message: {
			error: 'red',
			warning: 'orange',
			info: 'blue',
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
	},
	responsive: [{}, {}, {}, {}],
};
