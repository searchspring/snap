/*

	How does one plugin a theme into SnapLayout?
		> By using the theme...?

*/

// attempt using a theme to pass styles to all available components

import * as style from './styles/styles';

const pikeVariables = {
	color: {
		primary: 'blue',
		secondary: 'red',
	},
};

export const pike = {
	variables: pikeVariables,
	components: {
		button: {
			...style.components.button,
			// component theme prop overrides
		},
		autocompleteLayout: {
			style: style.layouts.autocomplete,
		},
	},
};

declare global {
	type PikeVariables = typeof pikeVariables;
}
