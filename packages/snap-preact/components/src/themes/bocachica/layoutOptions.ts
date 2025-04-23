import { ThemeLayoutOption } from '../../providers/theme';

const layoutOptions: ThemeLayoutOption[] = [
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

export const defaultLayoutOptions: ThemeLayoutOption[] = [];

export const mobileLayoutOptions: ThemeLayoutOption[] = layoutOptions;

export const tabletLayoutOptions: ThemeLayoutOption[] = layoutOptions;

export const desktopLayoutOptions: ThemeLayoutOption[] = [];
