import { ThemeComplete } from '../../providers/theme';

export const defaultLayoutOptions: ThemeComplete['layoutOptions'] = [];

export const mobileLayoutOptions: ThemeComplete['layoutOptions'] = [
	{
		value: 1,
		label: '',
		icon: 'square',
		overrides: {
			components: {
				'searchHorizontal results': {
					columns: 1,
				},
				'search results': {
					columns: 1,
				},
			},
		},
	},
	{
		value: 2,
		label: '',
		default: true,
		icon: 'layout-large',
		overrides: {
			components: {
				'searchHorizontal results': {
					columns: 2,
				},
				'search results': {
					columns: 2,
				},
			},
		},
	},
];

export const tabletLayoutOptions: ThemeComplete['layoutOptions'] = [];

export const desktopLayoutOptions: ThemeComplete['layoutOptions'] = [];
