import { ThemeComplete } from '../../providers/theme';

export const defaultLayoutOptions: ThemeComplete['layoutOptions'] = [];

export const mobileLayoutOptions: ThemeComplete['layoutOptions'] = [
	{
		value: 1,
		label: 'Uno',
		icon: 'square',
		overrides: {
			components: {
				'search results': {
					columns: 1,
				},
			},
		},
	},
	{
		value: 2,
		label: 'Dos',
		default: true,
		icon: 'layout-large',
		overrides: {
			components: {
				// search: {
				// 	theme: {
				// 		components: {
				// 			results: {
				// 				columns: 3,
				// 			},
				// 		},
				// 	},
				// },
				'search results': {
					columns: 3,
				},
			},
		},
	},
];

export const tabletLayoutOptions: ThemeComplete['layoutOptions'] = [];

export const desktopLayoutOptions: ThemeComplete['layoutOptions'] = [];
