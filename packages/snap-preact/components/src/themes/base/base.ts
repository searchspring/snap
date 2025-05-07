import { Theme, ThemeVariables } from '../../providers';
import { responsive } from './responsive';
import { components } from './components';

const baseVariables: ThemeVariables = {
	breakpoints: {
		mobile: 767,
		tablet: 1024,
		desktop: 1400,
	},
	colors: {
		text: '#333333',
		primary: '#3A23AD',
		secondary: '#4c3ce2',
		accent: '#00cee1',
	},
};

export const base: Theme = {
	name: 'bocachica',
	variables: baseVariables,
	components,
	responsive,
};
