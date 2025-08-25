import { css } from '@emotion/react';
import { autocompleteFixedThemeComponentProps } from '../../../themeComponents/autocompleteFixed';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteFixedProps } from '../../../../components/Templates/AutocompleteFixed';

// CSS in JS style script for the Search component
const autocompleteFixedStyleScript = ({}: AutocompleteFixedProps) => {
	return css({
		'.ss__autocomplete__button--see-more': {
			margin: '10px',
		},
	});
};

export const autocompleteFixed: ThemeComponent<'autocompleteFixed', AutocompleteFixedProps> = {
	default: {
		...autocompleteFixedThemeComponentProps.default,
		autocompleteFixed: {
			...(autocompleteFixedThemeComponentProps.default?.['autocompleteFixed'] || {}),
			themeStyleScript: autocompleteFixedStyleScript,
		},
	},
	mobile: autocompleteFixedThemeComponentProps.mobile,
	desktop: autocompleteFixedThemeComponentProps.desktop,
	tablet: autocompleteFixedThemeComponentProps.tablet,
};
