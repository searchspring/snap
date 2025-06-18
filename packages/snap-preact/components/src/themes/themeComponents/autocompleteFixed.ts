import { AutocompleteFixedProps } from '../../components/Templates/AutocompleteFixed';
import { ThemeComponent } from '../../providers';

export const autocompleteFixedThemeComponentProps: ThemeComponent<'autocompleteFixed', AutocompleteFixedProps> = {
	default: {
		'autocompleteFixed facet': {
			// valueProps,
			previewOnFocus: true,
			limit: 6,
			disableOverflow: true,
			disableCollapse: true,
		},
		'autocompleteFixed facetGridOptions': {
			// onClick: facetClickEvent,
			columns: 3,
		},
		'autocompleteFixed facetHierarchyOptions': {
			// onClick: facetClickEvent,
			hideCount: true,
		},
		'autocompleteFixed facetListOptions': {
			// onClick: facetClickEvent,
			hideCheckbox: true,
			hideCount: true,
		},
		'autocompleteFixed facetPaletteOptions': {
			// onClick: facetClickEvent,
			hideLabel: true,
			columns: 3,
		},
		'autocompleteFixed result': {
			hideBadge: true,
		},
		'autocompleteFixed recommendationGrid': {
			columns: 4,
			rows: 2,
		},
	},
	mobile: {
		autocompleteFixed: {
			layout: [['c1']],
			column1: {
				layout: [['termsList'], ['content'], ['_', 'button.see-more']],
				width: '100%',
			},
		},
		'autocompleteFixed results': {
			columns: 2,
			rows: 1,
		},

		'autocompleteFixed recommendationGrid': {
			columns: 2,
			rows: 1,
		},
		'autocompleteFixed searchInput': {
			closeSearchIcon: 'angle-left',
		},
	},
	tablet: {
		autocompleteFixed: {
			layout: [['c1', 'c3']],
		},
		'autocompleteFixed results': {
			columns: 3,
			rows: 1,
		},
	},
	desktop: {
		'autocompleteFixed results': {
			columns: 2,
			rows: 2,
		},
		'autocompleteFixed recommendationGrid': {
			columns: 3,
			rows: 2,
		},
	},
};
