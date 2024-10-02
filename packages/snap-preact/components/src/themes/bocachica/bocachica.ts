import { Theme, ThemeVariables } from '../../providers';
import { components } from './components';
import { layoutOptions } from './layoutOptions';
import { responsive } from './responsive';

const bocachicaVariables: ThemeVariables = {
	breakpoints: [767, 991, 1299],
	colors: {
		primary: '#202223',
		secondary: '#6d7175',
		accent: '#3a23ad',
	},
};

export const bocachica: Theme = {
	name: 'bocachica',
	variables: bocachicaVariables,
	components,
	layoutOptions,
	responsive,
};
