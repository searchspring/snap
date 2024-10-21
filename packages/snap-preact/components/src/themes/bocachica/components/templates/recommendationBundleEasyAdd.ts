import { css } from '@emotion/react';
import type { RecommendationBundleEasyAddProps } from '../../../../components/Templates/RecommendationBundleEasyAdd';

// CSS in JS style script for the RecommendationBundleEasyAdd component
const recommendationBundleEasyAddStyleScript = ({}: RecommendationBundleEasyAddProps) => {
	return css({});
};

// RecommendationBundle component props
export const recommendationBundleEasyAdd: Partial<RecommendationBundleEasyAddProps> = {
	styleScript: recommendationBundleEasyAddStyleScript,
};
