import { css } from '@emotion/react';
import { autocompleteSlideoutThemeComponentProps } from '../../../themeComponents/autocompleteSlideout';
import { ThemeComponent } from '../../../../providers';
import { AutocompleteSlideoutProps } from '../../../../components/Templates/AutocompleteSlideout';

// CSS in JS style script for the Search component
const autocompleteSlideoutStyleScript = ({}: AutocompleteSlideoutProps) => {
	return css({});
};

export const autocompleteSlideout: ThemeComponent<'autocompleteSlideout', AutocompleteSlideoutProps> = {
	default: {
		...autocompleteSlideoutThemeComponentProps.default,
		autocompleteSlideout: {
			...(autocompleteSlideoutThemeComponentProps.default?.['autocompleteSlideout'] || {}),
			themeStyleScript: autocompleteSlideoutStyleScript,
		},
		'autocompleteSlideout recommendationGrid': {
			columns: 2,
			rows: 2,
		},
	},
	mobile: autocompleteSlideoutThemeComponentProps.mobile,
	desktop: autocompleteSlideoutThemeComponentProps.desktop,
	tablet: autocompleteSlideoutThemeComponentProps.tablet,
};
