import { css } from '@emotion/react';
import type { CarouselProps } from '../../../../components/Molecules/Carousel';

// CSS in JS style script for the Carousel component
const carouselStyleScript = ({ vertical, theme }: CarouselProps) => {
	const variables = theme?.variables;

	return css({
		display: 'flex',
		maxWidth: '100%',
		maxHeight: vertical ? '100%' : undefined,
		margin: 0,
		padding: 0,
		overflow: 'hidden',

		'.swiper-notification': {
			position: 'absolute',
			left: '100000000000000px',
		},

		'&.ss__carousel-vertical': {
			flexDirection: 'column',
			'.swiper-slide': {
				/* Center slides vertically */
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			},

			'.swiper-container': {
				flexDirection: 'row',
			},

			'.swiper-pagination': {
				width: 'auto',
				order: 0,
				flexDirection: 'column',
				margin: 0,
				padding: '10px',
			},

			'.swiper-pagination-bullet': {
				margin: '4px',
			},
		},
		'.ss__carousel__next-wrapper, .ss__carousel__prev-wrapper': {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			'&.ss__carousel__next-wrapper--hidden, &.ss__carousel__prev-wrapper--hidden': {
				display: 'none',
			},
		},
		'.ss__carousel__next, .ss__carousel__prev': {
			padding: '5px',
			cursor: 'pointer',
			lineHeight: 0,

			'&.swiper-button-disabled': {
				opacity: '0.3',
				cursor: 'default',
			},
		},
		'.swiper-container': {
			display: 'flex',
			flexDirection: 'column',
			marginLeft: 'auto',
			marginRight: 'auto',
			position: 'relative',
			overflow: 'hidden',
			listStyle: 'none',
			padding: 0,
			zIndex: '1',
		},
		'.swiper-container-vertical': {
			'.swiper-wrapper': {
				flexDirection: 'column',
			},
		},
		'.swiper-wrapper': {
			order: 0,
			position: 'relative',
			width: '100%',
			height: '100%',
			zIndex: '1',
			display: 'flex',
			transitionProperty: 'transform',
			boxSizing: 'content-box',
		},
		'.swiper-slide': {
			flexShrink: 0,
			width: '100%',
			height: '100%',
			position: 'relative',
			transitionProperty: 'transform',
		},
		'.swiper-pagination': {
			display: 'flex',
			justifyContent: 'center',
			marginTop: '10px',
			width: '100%',
			order: 1,
			transition: '.3s opacity',
		},
		'.swiper-pagination-bullet': {
			width: '8px',
			height: '8px',
			display: 'inline-block',
			borderRadius: '50%',
			background: '#ccc',
			opacity: '.5',
			cursor: 'pointer',
			margin: '0 4px',
			'&.swiper-pagination-bullet-active': {
				opacity: '1',
				background: variables?.colors?.accent || '#3A23AD',
			},
		},
		'.swiper-container-pointer-events': {
			touchAction: 'pan-y',
			'&.swiper-container-vertical': {
				touchAction: 'pan-x',
			},
		},
		'.swiper-slide-invisible-blank': {
			visibility: 'hidden',
		},
	});
};

// Carousel component props
export const carousel: Partial<CarouselProps> = {
	styleScript: carouselStyleScript,
};
