import { Theme } from '../../providers';
import * as style from './styles/styles';

const pikeVariables: PikeVariables = {
	breakpoints: [0, 540, 767, 1200],
	color: {
		primary: 'blue',
		secondary: 'red',
	},
};

export type PikeVariables = {
	breakpoints?: [number, number, number, number];
	color?: {
		primary?: string;
		secondary?: string;
	};
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
