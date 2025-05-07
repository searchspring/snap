import { css } from '@emotion/react';
import type { FacetSliderProps } from '../../../../components/Molecules/FacetSlider';

// CSS in JS style script for the FacetSlider component
const facetSliderStyleScript = ({
	railColor,
	trackColor,
	handleColor,
	valueTextColor,
	handleDraggingColor,
	showTicks,
	stickyHandleLabel,
	theme,
}: FacetSliderProps) => {
	const variables = theme?.variables;

	return css({
		marginBottom: showTicks && stickyHandleLabel ? '22px' : showTicks || stickyHandleLabel ? '10px' : '5px',
		color: variables?.colors?.secondary,

		'& .ss__facet-slider__slider': {
			height: '5px',
			top: '0px',
			bottom: '10px',
			marginBottom: '30px',
		},

		'& .ss__facet-slider__rail': {
			background: railColor || variables?.colors?.secondary || '#333',
		},

		'& .ss__facet-slider__segment': {
			background: trackColor || '#f2f2f2',
			borderRadius: '3px',
		},

		'& .ss__facet-slider__handles': {
			'& button': {
				'& .ss__facet-slider__handle': {
					background: handleColor || variables?.colors?.secondary || '#333',
					color: valueTextColor || variables?.colors?.secondary || 'initial',

					'&.ss__facet-slider__handle--active': {
						background: handleDraggingColor || handleColor || variables?.colors?.secondary || '#000',
					},
				},
				'& .ss__facet-slider__handle:after': {
					background: 'none',
				},
				'label.ss__facet-slider__handle__label.ss__facet-slider__handle__label--sticky': {
					top: 'initial !important',
					bottom: '-20px',
				},
			},
		},

		'& .ss__facet-slider__labels': {
			color: variables?.colors?.secondary || valueTextColor,
		},
	});
};

// FacetSlider component props
export const facetSlider: ThemeComponent<'facetSlider', FacetSliderProps> = {
	default: {
		props: {
			themeStyleScript: facetSliderStyleScript,
			handleColor: 'black',
			handleDraggingColor: 'black',
			railColor: 'black',
			stickyHandleLabel: true,
		},
	},
};
