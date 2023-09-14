import { css, RecommendationProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Recommendation component
const recommendationStyleScript = ({ vertical, theme }: RecommendationProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		height: vertical ? '100%' : undefined,
		'& .ss__recommendation__title': {
			color: variables?.color?.primary,
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
