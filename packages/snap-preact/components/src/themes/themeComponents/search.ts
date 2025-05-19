import { SearchProps } from '../../components/Templates/Search';
import { ThemeComponent } from '../../providers';

export const searchThemeComponentProps: ThemeComponent<'search', SearchProps> = {
	default: {
		'search results': {
			columns: 4,
		},
	},
	mobile: {
		'search results': {
			columns: 2,
		},
	},
	tablet: {
		'search results': {
			columns: 3,
		},
	},
	desktop: {},
};
