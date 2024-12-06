import { css } from '@emotion/react';
import type { RecommendationBundleListProps } from '../../../../components/Templates/RecommendationBundleList';

// CSS in JS style script for the RecommendationBundleList component
const recommendationBundleStyleScript = ({}: RecommendationBundleListProps) => {
	return css({});
};

// RecommendationBundle component props
export const recommendationBundleList: Partial<RecommendationBundleListProps> = {
	themeStyleScript: recommendationBundleStyleScript,
};
