import { Theme, ThemeVariables } from '../../providers';
import { components } from './components';
import { layoutOptions } from './layoutOptions';
import { responsive } from './responsive';

const bocachicaVariables: ThemeVariables = {
	breakpoints: [0, 767, 1024, 1400],
	colors: {
		primary: '#202223',
		secondary: '#6d7175',
		accent: '#6d7175',
		active: {
			foreground: '#ffffff',
			background: '#6d7175',
			accent: '#ffffff',
		},
		hover: {
			foreground: '#ffffff',
			background: '#000000',
			accent: '#ffffff',
		},
	},
};

export const bocachica: Theme = {
	name: 'bocachica',
	variables: bocachicaVariables,
	components,
	layoutOptions,
	responsive,
};
