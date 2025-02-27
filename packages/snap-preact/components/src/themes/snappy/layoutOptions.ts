import { ThemeComplete } from '../../providers/theme';

const genericLayoutOptions: ThemeComplete['layoutOptions'] = [
	{
		value: 1,
		label: '',
		default: true,
		icon: 'layout-large',
		overrides: {
			components: {
				'searchHorizontal results': {
					columns: 4,
				},
				'search results': {
					columns: 4,
				},
			},
		},
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

export const defaultLayoutOptions: ThemeComplete['layoutOptions'] = genericLayoutOptions;

export const mobileLayoutOptions: ThemeComplete['layoutOptions'] = [
	{
		value: 1,
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

export const tabletLayoutOptions: ThemeComplete['layoutOptions'] = genericLayoutOptions;
export const desktopLayoutOptions: ThemeComplete['layoutOptions'] = genericLayoutOptions;
