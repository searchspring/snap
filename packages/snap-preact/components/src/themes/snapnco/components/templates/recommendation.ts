import { css } from '@emotion/react';
import type { RecommendationProps } from '../../../../components/Templates/Recommendation';
import { recommendationThemeComponentProps } from '../../../../components/Templates/Recommendation';

// CSS in JS style script for the Recommendation component
const recommendationStyleScript = ({ theme }: RecommendationProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		margin: '20px 0',
		'& .ss__recommendation__title': {
			color: variables?.colors?.primary,
			textAlign: 'center',
		},
	});
};

// Search component props come from Template export
export const recommendation: ThemeComponentProps<RecommendationProps> = {
	...recommendationThemeComponentProps,
	default: {
		...recommendationThemeComponentProps.default,
		themeStyleScript: recommendationStyleScript,
	},
};
