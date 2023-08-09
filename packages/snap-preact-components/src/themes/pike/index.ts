import { Theme } from '../../providers';
import * as style from './styles/styles';

export type PikeVariables = {
	breakpoints?: [number, number, number, number];
	color?: {
		primary?: string;
		secondary?: string;
	};
};

export type PikeTheme = Theme & {
	variables: PikeVariables;
	responsive: [Theme, Theme, Theme, Theme];
};

const pikeVariables: PikeVariables = {
	breakpoints: [0, 540, 767, 1200],
	color: {
		primary: 'blue',
		secondary: 'red',
	},
};

export const pike: PikeTheme = {
	variables: pikeVariables,
	components: {
		button: {
			...style.components.button,
			// component theme prop overrides
		},
	},
	responsive: [{}, {}, {}, {}],
};
