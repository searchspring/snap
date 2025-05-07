import { SearchProps } from '../../components/Templates/Search';

export const searchThemeComponentProps: ThemeComponent<'search', SearchProps> = {
	default: {
		components: {
			'*search results': {
				columns: 4,
			},
		},
	},
	mobile: {
		components: {
			'*search results': {
				columns: 2,
			},
		},
	},
	tablet: {
		components: {
			'*search results': {
				columns: 3,
			},
		},
	},
	desktop: {},
};
