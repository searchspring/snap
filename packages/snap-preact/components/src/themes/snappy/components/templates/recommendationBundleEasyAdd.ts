// import { css } from '@emotion/react';
import type { RecommendationBundleEasyAddProps } from '../../../../components/Templates/RecommendationBundleEasyAdd';

// CSS in JS style script for the RecommendationBundleEasyAdd component
// const recommendationBundleEasyAddStyleScript = ({}: RecommendationBundleEasyAddProps) => {
// 	return css({});
// };

// RecommendationBundle component props
export const recommendationBundleEasyAdd: ThemeComponentProps<RecommendationBundleEasyAddProps> = {
	default: {
		// themeStyleScript: recommendationBundleEasyAddStyleScript,
		theme: {
			components: {
				recommendationBundle: {
					hideCheckboxes: true,
					ctaInline: false,
					hideSeed: true,
					vertical: true,
					limit: 1,
					carousel: {
						enabled: false,
					},
					separatorIcon: false,
				},
			},
		},
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
