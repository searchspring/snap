import { css } from '@emotion/react';
import { autocompleteSlideoutThemeComponentProps } from '../../../themeComponents/autocompleteSlideout';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteSlideoutProps } from '../../../../components/Templates/AutocompleteSlideout';

// CSS in JS style script for the Search component
const autocompleteSlideoutStyleScript = ({}: AutocompleteSlideoutProps) => {
	return css({
		'.ss__autocomplete__button--see-more': {
			margin: '10px 0px',
			border: '0px',
		},
	});
};

export const autocompleteSlideout: ThemeComponent<'autocompleteSlideout', AutocompleteSlideoutProps> = {
	default: {
		...autocompleteSlideoutThemeComponentProps.default,
		autocompleteSlideout: {
			...(autocompleteSlideoutThemeComponentProps.default?.['autocompleteSlideout'] || {}),
			themeStyleScript: autocompleteSlideoutStyleScript,
		},
	},
	mobile: autocompleteSlideoutThemeComponentProps.mobile,
	desktop: autocompleteSlideoutThemeComponentProps.desktop,
	tablet: autocompleteSlideoutThemeComponentProps.tablet,
};
