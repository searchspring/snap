import { RecommendationBundleProps } from '../../components/Templates/RecommendationBundle';
import { ThemeComponent } from '../../providers';

export const recommendationBundleThemeComponentProps: ThemeComponent<'recommendationBundle', RecommendationBundleProps> = {
	default: {
		recommendationBundle: {
			carousel: {
				slidesPerView: 4,
				slidesPerGroup: 4,
				spaceBetween: 10,
			},
		},
	},
	mobile: {
		recommendationBundle: {
			carousel: {
				slidesPerView: 2,
				slidesPerGroup: 2,
				spaceBetween: 10,
			},
			ctaInline: false,
		},
	},
	tablet: {
		recommendationBundle: {
			carousel: {
				slidesPerView: 3,
				slidesPerGroup: 3,
				spaceBetween: 10,
			},
		},
	},
	desktop: {
		recommendationBundle: {
			carousel: {
				slidesPerView: 4,
				slidesPerGroup: 4,
				spaceBetween: 10,
			},
		},
	},
};
