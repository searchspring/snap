import { css } from '@emotion/react';
import type { RecommendationBundleProps } from '../../../../components/Templates/RecommendationBundle';

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

// RecommendationBundle component props
export const recommendationBundle: ThemeComponentProps<RecommendationBundleProps> = {
	default: {
		themeStyleScript: recommendationBundleStyleScript,
		carousel: {
			slidesPerView: 4,
			slidesPerGroup: 4,
			spaceBetween: 10,
		},
	},
	mobile: {
		carousel: {
			slidesPerView: 2,
			slidesPerGroup: 2,
			spaceBetween: 10,
		},
		ctaInline: false,
	},
	tablet: {
		carousel: {
			slidesPerView: 3,
			slidesPerGroup: 3,
			spaceBetween: 10,
		},
	},
	desktop: {
		carousel: {
			slidesPerView: 4,
			slidesPerGroup: 4,
			spaceBetween: 10,
		},
	},
};
