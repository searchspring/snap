import { ListOption } from '../../types';

export const layoutOptions: ListOption[] = [
	{
		value: 1,
		icon: 'square',
		// overrides: {
		// 	components: {
		// 		results: {
		// 			named: {
		// 				searchResults: { columns: 1 },
		// 			},
		// 		},
		// 	},
		// },
	},
	{
		value: 2,
		default: true,
		icon: 'layout-large',
		// overrides: {
		// 	components: {
		// 		results: {
		// 			named: {
		// 				searchResults: { columns: 2 },
		// 			},
		// 		},
		// 	},
		// },
	},
];
