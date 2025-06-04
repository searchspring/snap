import { AutocompleteSlideoutProps } from '../../components/Templates/AutocompleteSlideout';
import { ThemeComponent } from '../../providers';

export const autocompleteSlideoutThemeComponentProps: ThemeComponent<'autocompleteSlideout', AutocompleteSlideoutProps> = {
	default: {
		'autocompleteSlideout results': {
			columns: 2,
			rows: 2,
		},
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
