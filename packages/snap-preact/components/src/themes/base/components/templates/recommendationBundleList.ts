// import { css } from '@emotion/react';
import type { RecommendationBundleListProps } from '../../../../components/Templates/RecommendationBundleList';

// CSS in JS style script for the RecommendationBundleList component
// const recommendationBundleListStyleScript = ({}: RecommendationBundleListProps) => {
// 	return css({});
// };

// RecommendationBundleList component props
export const recommendationBundleList: ThemeComponentProps<RecommendationBundleListProps> = {
	default: {
		// themeStyleScript: recommendationBundleListStyleScript,
		theme: {
			components: {
				recommendationBundle: {
					ctaInline: false,
					carousel: {
						enabled: false,
						seedInCarousel: true,
					},
				},
			},
		},
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
