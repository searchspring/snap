import { AutocompleteModalProps } from '../../components/Templates/AutocompleteModal';
import { ThemeComponent } from '../../providers';

export const autocompleteModalThemeComponentProps: ThemeComponent<'autocompleteModal', AutocompleteModalProps> = {
	default: {
		'autocompleteModal facet': {
			// valueProps,
			previewOnFocus: true,
			limit: 6,
			disableOverflow: true,
			disableCollapse: true,
			searchable: false,
		},
		'autocompleteModal facetGridOptions': {
			// onClick: facetClickEvent,
			columns: 3,
		},
		'autocompleteModal facetHierarchyOptions': {
			// onClick: facetClickEvent,
			hideCount: true,
		},
		'autocompleteModal facetListOptions': {
			// onClick: facetClickEvent,
			hideCheckbox: true,
			hideCount: true,
		},
		'autocompleteModal facetPaletteOptions': {
			// onClick: facetClickEvent,
			hideLabel: true,
			columns: 3,
		},
		'autocompleteModal result': {
			hideBadge: true,
		},
		'autocompleteModal recommendationGrid': {
			columns: 4,
			rows: 2,
		},
	},
	mobile: {
		autocompleteModal: {
			layout: [['c1']],
			column1: {
				layout: [['termsList'], ['content'], ['_', 'button.see-more']],
				width: '100%',
			},
		},
		'autocompleteModal results': {
			columns: 2,
			rows: 1,
		},

		'autocompleteModal recommendationGrid': {
			columns: 2,
			rows: 1,
		},
	},
	tablet: {
		autocompleteModal: {
			layout: [['c1', 'c3']],
		},
		'autocompleteModal results': {
			columns: 3,
			rows: 1,
		},
	},
	desktop: {
		'autocompleteModal results': {
			columns: 2,
			rows: 2,
		},
		'autocompleteModal recommendationGrid': {
			columns: 3,
			rows: 2,
		},
	},
};
