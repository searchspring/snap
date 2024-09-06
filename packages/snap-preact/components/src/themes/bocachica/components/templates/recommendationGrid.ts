import { css } from '@emotion/react';
import type { RecommendationGridProps } from '../../../../components/Templates/RecommendationGrid';

// CSS in JS style script for the RecommendationGrid component
const recommendationGridStyleScript = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars

	return css();
};

// RecommendationGrid component props
export const recommendationGrid: Partial<RecommendationGridProps> = {
	styleScript: recommendationGridStyleScript,
};
