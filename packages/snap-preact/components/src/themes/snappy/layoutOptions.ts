import { ThemeLayoutOption } from '../../providers/theme';

const layoutOptions: ThemeLayoutOption[] = [
	{
		value: 1,
		label: '',
		default: true,
		icon: 'layout-large',
	},
	{
		value: 2,
		label: '',
		icon: 'layout-list',
		overrides: {
			components: {
				'searchHorizontal result': {
					layout: 'list',
				},
				'search result': {
					layout: 'list',
				},
				'searchHorizontal results': {
					columns: 1,
				},
				'search results': {
					columns: 1,
				},
			},
		},
	},
];

export const defaultLayoutOptions: ThemeLayoutOption[] = layoutOptions;

export const mobileLayoutOptions: ThemeLayoutOption[] = layoutOptions;

export const tabletLayoutOptions: ThemeLayoutOption[] = layoutOptions;

export const desktopLayoutOptions: ThemeLayoutOption[] = layoutOptions;
