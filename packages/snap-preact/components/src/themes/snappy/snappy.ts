import { ThemeComplete, ThemeVariables } from '../../providers';
import { components } from './components';
import { responsive } from './responsive';

const snappyVariables: ThemeVariables = {
	breakpoints: {
		mobile: 767,
		tablet: 991,
		desktop: 1299,
	},
	colors: {
		text: '#222222',
		primary: '#202223',
		secondary: '#6d7175',
		accent: '#3a23ad',
	},
};

export const snappy: ThemeComplete = {
	name: 'snappy',
	variables: snappyVariables,
	components,
	responsive,
};
