import { css, RecommendationProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Recommendation component
const recommendationStyleScript = ({ vertical, theme }: RecommendationProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		height: vertical ? '100%' : undefined,
		'.ss__result__image-wrapper': {
			height: vertical ? '85%' : undefined,
		},
	});
};

// Recommendation component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/organisms-recommendation--default
export const recommendation: Omit<RecommendationProps, 'controller'> = {
	styleScript: recommendationStyleScript,
};
