import { AutocompleteSlideoutProps } from '../../components/Templates/AutocompleteSlideout';
import { ThemeComponent } from '../../providers';

export const autocompleteSlideoutThemeComponentProps: ThemeComponent<'autocompleteSlideout', AutocompleteSlideoutProps> = {
	default: {
		'autocompleteSlideout results': {
			columns: 2,
			rows: 2,
		},
		'autocompleteSlideout facet': {
			// valueProps,
			previewOnFocus: true,
			limit: 6,
			disableOverflow: true,
			disableCollapse: true,
			searchable: false,
		},
		'autocompleteSlideout facetGridOptions': {
			// onClick: facetClickEvent,
			columns: 3,
		},
		'autocompleteSlideout facetHierarchyOptions': {
			// onClick: facetClickEvent,
			hideCount: true,
		},
		'autocompleteSlideout facetListOptions': {
			// onClick: facetClickEvent,
			hideCheckbox: true,
			hideCount: true,
		},
		'autocompleteSlideout facetPaletteOptions': {
			// onClick: facetClickEvent,
			hideLabel: true,
			columns: 3,
		},
		'autocompleteSlideout result': {
			hideBadge: true,
		},
		'autocompleteSlideout recommendationGrid': {
			columns: 4,
			rows: 2,
		},
	},
	mobile: {
		autocompleteSlideout: {
			layout: [['c1']],
			column1: {
				layout: [['termsList'], ['content'], ['_', 'button.see-more']],
				width: '100%',
			},
		},
		'autocompleteSlideout results': {
			columns: 2,
			rows: 1,
		},

		'autocompleteSlideout recommendationGrid': {
			columns: 2,
			rows: 1,
		},
	},
	tablet: {
		autocompleteSlideout: {
			layout: [['c1', 'c3']],
		},
		'autocompleteSlideout results': {
			columns: 3,
			rows: 1,
		},
	},
	desktop: {
		'autocompleteSlideout results': {
			columns: 2,
			rows: 2,
		},
		'autocompleteSlideout recommendationGrid': {
			columns: 3,
			rows: 2,
		},
	},
};
