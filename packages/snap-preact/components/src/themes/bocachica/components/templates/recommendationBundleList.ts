import { css } from '@emotion/react';
import type { RecommendationBundleListProps } from '../../../../components/Templates/RecommendationBundleList';
import { recommendationBundleListThemeComponentProps } from '../../../themeComponents/recommendationBundleList';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the RecommendationBundle component
const recommendationBundleListStyleScript = ({ theme }: RecommendationBundleListProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;
	return css({
		border: `1px solid ${variables?.colors.accent}`,
		padding: '20px',

		'.ss__recommendation-bundle-list__title': {
			textAlign: 'center',
			marginBottom: '20px',
		},

		'.cta__inner__price__wrapper': {
			justifyContent: 'space-evenly',
			display: 'flex',
			'.ss__price': {
				margin: '0px',
			},
		},
	});
};

// RecommendationBundleList component props come from Template export
export const recommendationBundleList: ThemeComponent<'recommendationBundleList', RecommendationBundleListProps> = {
	default: {
		...recommendationBundleListThemeComponentProps.default,
		recommendationBundleList: {
			...(recommendationBundleListThemeComponentProps.default?.['recommendationBundleList'] || {}),
			themeStyleScript: recommendationBundleListStyleScript,
		},
	},
	mobile: recommendationBundleListThemeComponentProps.mobile,
	desktop: recommendationBundleListThemeComponentProps.desktop,
	tablet: recommendationBundleListThemeComponentProps.tablet,
};
