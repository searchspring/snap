import { css } from '@emotion/react';
import type { AutocompleteTemplateProps } from '../../../../components/Templates/AutocompleteTemplate';
import { autocompleteThemeComponentProps } from '../../../themeComponents/autocompleteTemplate';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the Search component
const autocompleteTemplateStyleScript = ({ theme }: AutocompleteTemplateProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// AutocompleteTemplate component props come from Template export
export const autocompleteTemplate: ThemeComponent<'autocompleteTemplate', AutocompleteTemplateProps> = {
	default: {
		...autocompleteThemeComponentProps.default,
		autocompleteTemplate: {
			...(autocompleteThemeComponentProps.default?.['autocompleteTemplate'] || {}),
			themeStyleScript: autocompleteTemplateStyleScript,
		},
	},
	mobile: autocompleteThemeComponentProps.mobile,
	desktop: autocompleteThemeComponentProps.desktop,
	tablet: autocompleteThemeComponentProps.tablet,
};
