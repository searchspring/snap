import { css } from '@emotion/react';
import { autocompleteFixedThemeComponentProps } from '../../../themeComponents/autocompleteFixed';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteFixedProps } from '../../../../components/Templates/AutocompleteFixed';

// CSS in JS style script for the Search component
const autocompleteFixedStyleScript = ({}: AutocompleteFixedProps) => {
	return css({});
};

export const autocompleteFixed: ThemeComponent<'autocompleteFixed', AutocompleteFixedProps> = {
	default: {
		...autocompleteFixedThemeComponentProps.default,
		autocompleteFixed: {
			...(autocompleteFixedThemeComponentProps.default?.['autocompleteFixed'] || {}),
			themeStyleScript: autocompleteFixedStyleScript,
		},
		'autocompleteFixed recommendationGrid': {
			columns: 4,
			rows: 1,
		},
	},
	mobile: autocompleteFixedThemeComponentProps.mobile,
	desktop: autocompleteFixedThemeComponentProps.desktop,
	tablet: autocompleteFixedThemeComponentProps.tablet,
};
