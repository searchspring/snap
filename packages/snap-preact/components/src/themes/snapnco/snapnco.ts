import { ThemeComplete, ThemeVariables } from '../../providers';
import { components } from './components';
import { defaultLayoutOptions } from './layoutOptions';
import { responsive } from './responsive';

const snapncoVariables: ThemeVariables = {
	breakpoints: [767, 991, 1299],
	colors: {
		text: '#222222',
		primary: '#202223',
		secondary: '#6d7175',
		accent: '#3a23ad',
	},
};

export const snapnco: ThemeComplete = {
	name: 'snapnco',
	variables: snapncoVariables,
	components,
	layoutOptions: defaultLayoutOptions,
	responsive,
};
