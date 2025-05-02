// import { css } from '@emotion/react';
import type { AutocompleteTemplateProps } from '../../../../components/Templates/AutocompleteTemplate';
import { autocompleteThemeComponentProps } from '../../../../components/Templates/AutocompleteTemplate';

// CSS in JS style script for the Search component
// const searchStyleScript = ({ theme }: AutocompleteTemplateProps) => {
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const variables = theme?.variables;

// 	return css({});
// };

// Search component props come from Template export
export const autocompleteTemplate: ThemeComponentProps<AutocompleteTemplateProps> = autocompleteThemeComponentProps;
