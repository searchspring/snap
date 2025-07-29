import { css } from '@emotion/react';
import { autocompleteFixedThemeComponentProps } from '../../../themeComponents/autocompleteFixed';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteSlideoutProps } from '../../../../components/Templates/AutocompleteSlideout';

// CSS in JS style script for the Search component
const autocompleteFixedStyleScript = ({}: AutocompleteSlideoutProps) => {
	return css({});
};

export const autocompleteFixed: ThemeComponent<'autocompleteFixed', AutocompleteSlideoutProps> = {
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
