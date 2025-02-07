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
			},
		},

		'& .ss__facet-slider__labels': {
			color: variables?.colors?.secondary || valueTextColor,
		},
	});
};

// FacetSlider component props
export const facetSlider: Partial<FacetSliderProps> = {
	themeStyleScript: facetSliderStyleScript,
};
