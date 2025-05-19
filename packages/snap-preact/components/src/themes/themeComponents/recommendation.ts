import { RecommendationProps } from '../../components/Templates/Recommendation';
import { ThemeComponent } from '../../providers';

export const recommendationThemeComponentProps: ThemeComponent<'recommendation', RecommendationProps> = {
	default: {
		recommendation: {
			slidesPerView: 5,
			slidesPerGroup: 5,
		},
	},
	mobile: {
		recommendation: {
			slidesPerView: 2,
			slidesPerGroup: 2,
		},
	},
	tablet: {
		recommendation: {
			slidesPerView: 3,
			slidesPerGroup: 3,
		},
	},
	desktop: {
		recommendation: {
			slidesPerView: 4,
			slidesPerGroup: 4,
		},
	},
};
