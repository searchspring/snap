import { RecommendationProps } from '../../components/Templates/Recommendation';
import { ThemeComponent } from '../../providers';

export const recommendationThemeComponentProps: ThemeComponent<'recommendationThemeComponentProps', RecommendationProps> = {
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
