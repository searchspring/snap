import { css } from '@emotion/react';
import { autocompleteFixedThemeComponentProps } from '../../../themeComponents/autocompleteFixed';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteSlideoutProps } from '../../../../components/Templates/AutocompleteSlideout';

// CSS in JS style script for the Search component
const autocompleteFixedStyleScript = ({}: AutocompleteSlideoutProps) => {
	return css({
		'& .ss__facets__facet': {
			marginBottom: '10px',
		},
		'& .ss__dropdown.ss__facet__dropdown': {
			padding: '5px',
			borderRadius: '12px',
		},

		'.ss__autocomplete__facets-wrapper': {
			'.ss__facet-grid-options__option': {
				'.ss__facet-grid-options__option__value.ss__facet-grid-options__option__value--smaller': {
					fontSize: '60%',
				},
			},
		},
		'.ss__autocomplete__button--see-more': {
			margin: '10px',
		},

		'& .ss__autocomplete__content__results .ss__result .ss__image': {
			minHeight: '200px',
		},
	});
};

export const autocompleteFixed: ThemeComponent<'autocompleteFixed', AutocompleteSlideoutProps> = {
	default: {
		...autocompleteFixedThemeComponentProps.default,
		autocompleteFixed: {
			...(autocompleteFixedThemeComponentProps.default?.['autocompleteFixed'] || {}),
			themeStyleScript: autocompleteFixedStyleScript,
		},

		'autocompleteFixed recommendationGrid': {
			columns: 4,
			rows: 2,
		},
	},
	mobile: autocompleteFixedThemeComponentProps.mobile,
	desktop: autocompleteFixedThemeComponentProps.desktop,
	tablet: autocompleteFixedThemeComponentProps.tablet,
};
