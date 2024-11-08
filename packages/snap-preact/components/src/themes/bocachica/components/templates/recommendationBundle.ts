import { css } from '@emotion/react';
import type { RecommendationBundleProps } from '../../../../components/Templates/RecommendationBundle';

// CSS in JS style script for the RecommendationBundle component
const recommendationBundleStyleScript = ({ slidesPerView, spaceBetween, ctaInline, vertical, separatorIcon, theme }: any) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		margin: '20px 0',
		'.ss__recommendation-bundle__wrapper': {
			display: 'flex',
			maxWidth: '100%',
			margin: '0',
			padding: '0',
		},

		'.ss__recommendation-bundle__wrapper__selector--seed': {
			width: `${vertical ? '100%' : 'auto'}`,
			margin: `${!separatorIcon ? 'auto !important' : 'initial'}`,
		},

		'.ss__recommendation-bundle__wrapper__seed-container': {
			width: vertical ? '100%' : `calc(100% / ${slidesPerView + (!ctaInline ? 0 : 1)})`,
		},

		'.ss__recommendation-bundle__wrapper__cta': {
			width: vertical ? '100%' : `${!ctaInline ? '100%' : `calc(100% / ${slidesPerView + 1})`}`,

			textAlign: 'center',

			'& .ss__recommendation-bundle__wrapper__cta__subtotal__prices': {
				display: 'block',
			},
		},

		'.ss__recommendation-bundle__wrapper__carousel': {
			boxSizing: 'border-box',
			width: vertical ? '100%' : `calc(calc(100% / ${slidesPerView + (!ctaInline ? 0 : 1)}) * ${slidesPerView - 1})`,
		},

		'.ss__recommendation-bundle__wrapper--seed-in-carousel': {
			'.ss__recommendation-bundle__wrapper__cta': {
				width: vertical ? '100%' : `calc(100% / ${slidesPerView + (!ctaInline ? 0 : 1)})`,
			},

			'.ss__recommendation-bundle__wrapper__carousel': {
				width: vertical ? '100%' : `calc(calc(100% / ${slidesPerView + (!ctaInline ? 0 : 1)}) * ${slidesPerView})`,
				padding: '0',
			},
		},

		'.swiper-slide, .swiper-slide-visible.swiper-last-visible-slide': {
			'.ss__recommendation-bundle__wrapper__selector__icon': {
				display: 'none',
			},
		},

		'.swiper-slide-visible': {
			'.ss__recommendation-bundle__wrapper__selector__icon': {
				display: 'block',
			},
		},

		'.ss__recommendation-bundle__wrapper--vertical': {
			flexDirection: 'column',
		},

		'.ss__recommendation-bundle__wrapper__selector': {
			alignItems: 'baseline',
			position: 'relative',

			'&.ss__recommendation-bundle__wrapper__selector--last': {
				'& .ss__recommendation-bundle__wrapper__selector__icon': {
					display: 'none',
				},
			},

			'& .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge': {
				position: 'absolute',
				top: '0',
				left: '0',
				zIndex: '1',
				backgroundColor: variables?.colors.accent,
				color: '#fff',
			},

			'& .ss__recommendation-bundle__wrapper__selector__icon': {
				position: 'absolute',
				right: '-1em',
				top: '140px',
			},

			'& .ss__recommendation-bundle__wrapper__selector__result-wrapper': {
				alignItems: 'center',
				position: 'relative',
				margin: `0px ${5 + (spaceBetween || 0)}px`,
			},
			'& .ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox': {
				position: 'absolute',
				top: '0',
				right: '0',
				zIndex: '1',
				cursor: 'pointer',
			},
		},
	});
};

// RecommendationBundle component props
export const recommendationBundle: Partial<RecommendationBundleProps> = {
	themeStyleScript: recommendationBundleStyleScript,
};
