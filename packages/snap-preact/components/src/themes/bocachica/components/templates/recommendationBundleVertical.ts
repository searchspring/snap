import { css } from '@emotion/react';
import type { RecommendationBundleVerticalProps } from '../../../../components/Templates/RecommendationBundleVertical';

// CSS in JS style script for the RecommendationBundleVertical component
const recommendationBundleStyleScript = ({}: RecommendationBundleVerticalProps) => {
	return css({});
};

// RecommendationBundle component props
export const recommendationBundleVertical: Partial<RecommendationBundleVerticalProps> = {
	themeStyleScript: recommendationBundleStyleScript,
};
