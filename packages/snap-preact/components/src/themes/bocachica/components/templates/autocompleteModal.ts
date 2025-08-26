import { css } from '@emotion/react';
import { autocompleteModalThemeComponentProps } from '../../../themeComponents/autocompleteModal';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteModalProps } from '../../../../components/Templates/AutocompleteModal';

// CSS in JS style script for the Search component
const autocompleteModalStyleScript = ({}: AutocompleteModalProps) => {
	return css({
		'.ss__autocomplete__button--see-more': {
			margin: '10px',
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
			rows: 1,
		},
	},
	mobile: autocompleteModalThemeComponentProps.mobile,
	desktop: autocompleteModalThemeComponentProps.desktop,
	tablet: autocompleteModalThemeComponentProps.tablet,
};
