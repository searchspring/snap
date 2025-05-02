import { css } from '@emotion/react';
import type { RecommendationBundleProps } from '../../../../components/Templates/RecommendationBundle';
import { recommendationBundleThemeComponentProps } from '../../../../components/Templates/RecommendationBundle';

// CSS in JS style script for the RecommendationBundle component
const recommendationBundleStyleScript = ({ theme }: any) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		margin: '20px 0',

		'.ss__recommendation-bundle__wrapper__selector': {
			'& .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge': {
				backgroundColor: variables?.colors.accent,
				color: '#fff',
			},
		},
	});
};

export const recommendationBundle: ThemeComponentProps<RecommendationBundleProps> = {
	...recommendationBundleThemeComponentProps,
	default: {
		...recommendationBundleThemeComponentProps.default,
		themeStyleScript: recommendationBundleStyleScript,
	},
};
