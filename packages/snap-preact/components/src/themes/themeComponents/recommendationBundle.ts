import { RecommendationBundleProps } from '../../components/Templates/RecommendationBundle';
import { ThemeComponent } from '../../providers';

export const recommendationBundleThemeComponentProps: ThemeComponent<'recommendationBundleThemeComponentProps', RecommendationBundleProps> = {
	default: {
		props: {
			carousel: {
				slidesPerView: 4,
				slidesPerGroup: 4,
				spaceBetween: 10,
			},
		},
	},
	mobile: {
		props: {
			carousel: {
				slidesPerView: 2,
				slidesPerGroup: 2,
				spaceBetween: 10,
			},
			ctaInline: false,
		},
	},
	tablet: {
		props: {
			carousel: {
				slidesPerView: 3,
				slidesPerGroup: 3,
				spaceBetween: 10,
			},
		},
	},
	desktop: {
		props: {
			carousel: {
				slidesPerView: 4,
				slidesPerGroup: 4,
				spaceBetween: 10,
			},
		},
	},
};
