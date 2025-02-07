import { css } from '@emotion/react';
import type { RecommendationProps } from '../../../../components/Templates/Recommendation';

// CSS in JS style script for the Recommendation component
const recommendationStyleScript = ({ theme }: RecommendationProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		margin: '20px 0',
		'& .ss__recommendation__title': {
			color: variables?.colors?.primary,
		},
	});
};

// Recommendation component props
export const recommendation: Partial<RecommendationProps> = {
	themeStyleScript: recommendationStyleScript,
};
