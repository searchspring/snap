import { css } from '@emotion/react';
import { autocompleteModalThemeComponentProps } from '../../../themeComponents/autocompleteModal';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteModalProps } from '../../../../components/Templates/AutocompleteModal';

// CSS in JS style script for the Search component
const autocompleteModalStyleScript = ({}: AutocompleteModalProps) => {
	return css({});
};

export const autocompleteModal: ThemeComponent<'autocompleteModal', AutocompleteModalProps> = {
	default: {
		...autocompleteModalThemeComponentProps.default,
		autocompleteModal: {
			...(autocompleteModalThemeComponentProps.default?.['autocompleteModal'] || {}),
			themeStyleScript: autocompleteModalStyleScript,
		},
	},
	mobile: autocompleteModalThemeComponentProps.mobile,
	desktop: autocompleteModalThemeComponentProps.desktop,
	tablet: autocompleteModalThemeComponentProps.tablet,
};
