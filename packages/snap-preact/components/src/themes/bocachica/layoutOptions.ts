import { Theme } from '../../providers/theme';

export const layoutOptions: Theme['layoutOptions'] = [
	{
		value: 1,
		icon: 'square',
		overrides: {
			components: {
				'results.search': {
					columns: 1,
				},
			},
		},
	},
	{
		value: 2,
		default: true,
		icon: 'layout-large',
		overrides: {
			components: {
				'results.search': {
					columns: 2,
				},
			},
		},
	},
];
