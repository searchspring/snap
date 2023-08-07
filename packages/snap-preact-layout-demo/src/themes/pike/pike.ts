/*

	How does one plugin a theme into SnapLayout?
		> By using the theme...?

*/

// attempt using a theme to pass styles to all available components

import { Theme } from '@searchspring/snap-preact-components';
import * as style from './styles/styles';

const pikeVariables = {
	color: {
		primary: 'blue',
		secondary: 'red',
	},
};

export const pike: Theme = {
	variables: pikeVariables,
	components: {
		button: {
			...style.components.button,
			// component theme prop overrides
		},
	},
};

declare global {
	type PikeVariables = typeof pikeVariables;
}
