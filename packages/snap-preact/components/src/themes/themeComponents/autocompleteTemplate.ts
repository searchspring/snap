import { AutocompleteTemplateProps } from '../../components/Organisms/AutocompleteTemplate';
import { ThemeComponent } from '../../providers';

export const autocompleteThemeComponentProps: ThemeComponent<'autocompleteTemplate', AutocompleteTemplateProps> = {
	default: {
		'autocompleteTemplate facet': {
			// valueProps,
			previewOnFocus: true,
			limit: 6,
			disableOverflow: true,
			disableCollapse: true,
		},
		'autocompleteTemplate facetGridOptions': {
			// onClick: facetClickEvent,
			columns: 3,
		},
		'autocompleteTemplate facetHierarchyOptions': {
			// onClick: facetClickEvent,
			hideCount: true,
		},
		'autocompleteTemplate facetListOptions': {
			// onClick: facetClickEvent,
			hideCheckbox: true,
			hideCount: true,
		},
		'autocompleteTemplate facetPaletteOptions': {
			// onClick: facetClickEvent,
			hideLabel: true,
			columns: 3,
		},
		'autocompleteTemplate result': {
			hideBadge: true,
		},
		'autocompleteTemplate recommendationGrid': {
			columns: 4,
			rows: 2,
		},
	},
	mobile: {
		autocompleteTemplate: {
			layout: [['c1']],
			column1: {
				layout: [['termsList'], ['content'], ['_', 'button.see-more']],
				width: '100%',
			},
		},
		'autocompleteTemplate results': {
			columns: 2,
			rows: 1,
		},

		'autocompleteTemplate recommendationGrid': {
			columns: 2,
			rows: 1,
		},
	},
	tablet: {
		autocompleteTemplate: {
			layout: [['c1', 'c3']],
		},
		'autocompleteTemplate results': {
			columns: 3,
			rows: 1,
		},
	},
	desktop: {
		// layout: [['c1', 'c2', 'c3']],
		// column1: {
		// 	layout: ['termsList'],
		// 	width: '150px',
		// },
		// column2: {
		// 	layout: ['facets'],
		// 	width: '150px',
		// },
		// column3: {
		// 	layout: [['content'], ['_', 'button.see-more']],
		// 	width: 'auto',
		// },
		'autocompleteTemplate results': {
			columns: 2,
			rows: 2,
		},
		'autocompleteTemplate recommendationGrid': {
			columns: 3,
			rows: 2,
		},
	},
};
