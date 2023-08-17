import { Theme } from '../../providers';
import * as style from './styles/styles';

export type EverestVariables = {
	breakpoints?: [number, number, number, number];
	color?: {
		primary?: string;
		secondary?: string;
		hover?: string;
	};
};

export type EverestTheme = Theme & {
	variables: EverestVariables;
	responsive: [Theme, Theme, Theme, Theme];
};

const everestVariables: EverestVariables = {
	breakpoints: [0, 540, 767, 1200],
	color: {
		primary: 'blue',
		secondary: 'red',
		hover: 'red',
	},
};

export const everest: EverestTheme = {
	variables: everestVariables,
	components: {
		button: {
			...style.components.button,
			// component theme prop overrides
		},
		badge: {
			...style.components.badge,
			// component theme prop overrides
		},
	},
	responsive: [{}, {}, {}, {}],
};
