// import { css } from '@emotion/react';
import type { RecommendationProps } from '../../../../components/Templates/Recommendation';

// CSS in JS style script for the Recommendation component
// const recommendationStyleScript = ({ }: RecommendationProps) => {
// 	return css({});
// };

// Recommendation component props
export const recommendation: ThemeComponentProps<RecommendationProps> = {
	default: {
		// themeStyleScript: recommendationStyleScript,
		slidesPerView: 5,
		slidesPerGroup: 5,
	},
	mobile: {
		slidesPerView: 2,
		slidesPerGroup: 2,
	},
	tablet: {
		slidesPerView: 3,
		slidesPerGroup: 3,
	},
	desktop: {
		slidesPerView: 4,
		slidesPerGroup: 4,
	},
};
