import { css } from '@emotion/react';
import type { RecommendationProps } from '../../../../components/Templates/Recommendation';

// CSS in JS style script for the Recommendation component
const recommendationStyleScript = ({ vertical, theme }: RecommendationProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		margin: '20px 0',
		height: vertical ? '100%' : undefined,
		'& .ss__recommendation__title': {
			color: variables?.colors?.primary,
		},
		'.ss__result__image-wrapper': {
			height: vertical ? '85%' : undefined,
		},
	});
};

// Recommendation component props
export const recommendation: Partial<RecommendationProps> = {
	styleScript: recommendationStyleScript,
};
