import { css } from '@emotion/react';
import type { RecommendationBundleProps } from '../../../../components/Templates/RecommendationBundle';

// CSS in JS style script for the RecommendationBundle component
const recommendationBundleStyleScript = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars

	return css();
};

// RecommendationBundle component props
export const recommendationBundle: Partial<RecommendationBundleProps> = {
	styleScript: recommendationBundleStyleScript,
};
