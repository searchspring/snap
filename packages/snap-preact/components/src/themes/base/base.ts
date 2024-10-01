import { Theme, ThemeVariables } from '../../providers';

const baseVariables: ThemeVariables = {
	breakpoints: [0, 767, 1024, 1400],
	colors: {
		primary: '#3A23AD',
		secondary: '#4c3ce2',
		accent: '#00cee1',
	},
};

export const base: Theme = {
	name: 'bocachica',
	variables: baseVariables,
};
