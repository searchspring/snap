import { RecommendationProps } from '../../components/Templates/Recommendation';

export const recommendationThemeComponentProps: ThemeComponent<'autrecommendationThemeComponentPropsocompleteTemplate', RecommendationProps> = {
	default: {
		props: {
			slidesPerView: 5,
			slidesPerGroup: 5,
		},
	},
	mobile: {
		props: {
			slidesPerView: 2,
			slidesPerGroup: 2,
		},
	},
	tablet: {
		props: {
			slidesPerView: 3,
			slidesPerGroup: 3,
		},
	},
	desktop: {
		props: {
			slidesPerView: 4,
			slidesPerGroup: 4,
		},
	},
};
