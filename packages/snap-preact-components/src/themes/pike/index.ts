import { Theme, ThemeVariables } from '../../providers';
import * as style from './styles/styles';

const pikeVariables: ThemeVariables = {
	breakpoints: [0, 540, 767, 1200],
	color: {
		primary: 'blue',
		secondary: 'blue',
		accent: 'blue',
		active: {
			foreground: '',
			background: '',
			accent: '',
		},
		hover: {
			foreground: '',
			background: '',
			accent: '',
		},
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
	responsive: [{}, {}, {}, {}],
};
