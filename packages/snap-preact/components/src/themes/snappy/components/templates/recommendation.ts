import { css } from '@emotion/react';
import type { RecommendationProps } from '../../../../components/Templates/Recommendation';
import { recommendationThemeComponentProps } from '../../../themeComponents/recommendation';
import { ThemeComponent } from '../../../../providers';
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

// Recommendation component props come from Template export
export const recommendation: ThemeComponent<'recommendation', RecommendationProps> = {
	default: {
		props: {
			...recommendationThemeComponentProps.default?.props,
			themeStyleScript: recommendationStyleScript,
		},
		components: recommendationThemeComponentProps.default?.components,
	},
	mobile: recommendationThemeComponentProps.mobile,
	desktop: recommendationThemeComponentProps.desktop,
	tablet: recommendationThemeComponentProps.tablet,
};
