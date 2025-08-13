import { css } from '@emotion/react';
import { autocompleteModalThemeComponentProps } from '../../../themeComponents/autocompleteModal';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteModalProps } from '../../../../components/Templates/AutocompleteModal';

// CSS in JS style script for the Search component
const autocompleteModalStyleScript = ({}: AutocompleteModalProps) => {
	return css({
		'& .ss__facets__facet': {
			marginBottom: '10px',
		},
		'& .ss__dropdown.ss__facet__dropdown': {
			padding: '5px',
			borderRadius: '12px',
		},
		'.ss__autocomplete__facets-wrapper .ss__facet-grid-options__option .ss__facet-grid-options__option__value.ss__facet-grid-options__option__value--smaller':
			{
				fontSize: '60%',
			},
		'.ss__autocomplete__button--see-more': {
			margin: '10px',
		},
		'& .ss__autocomplete__content__results .ss__result .ss__image': {
			minHeight: '200px',
		},
	});
};

export const autocompleteModal: ThemeComponent<'autocompleteModal', AutocompleteModalProps> = {
	default: {
		...autocompleteModalThemeComponentProps.default,
		autocompleteModal: {
			...(autocompleteModalThemeComponentProps.default?.['autocompleteModal'] || {}),
			themeStyleScript: autocompleteModalStyleScript,
		},
		'autocompleteModal recommendationGrid': {
			columns: 4,
			rows: 2,
		},
	},
	mobile: autocompleteModalThemeComponentProps.mobile,
	desktop: autocompleteModalThemeComponentProps.desktop,
	tablet: autocompleteModalThemeComponentProps.tablet,
};
