import { css, FacetSliderProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the FacetSlider component
const facetSliderStyleScript = ({
	railColor,
	trackColor,
	handleColor,
	valueTextColor,
	handleDraggingColor,
	showTicks,
	stickyHandleLabel,
	tickTextColor,
	theme,
}: FacetSliderProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'flex',
		flexDirection: 'column',
		marginTop: '5px',
		marginBottom: showTicks && stickyHandleLabel ? '22px' : showTicks || stickyHandleLabel ? '10px' : '5px',
		color: variables?.color?.secondary,

		'& .ss__facet-slider__slider': {
			position: 'relative',
			display: 'inline-block',
			height: '8px',
			width: 'calc(100% - 2rem)',
			margin: stickyHandleLabel ? '1rem' : '0 1rem',
			top: '10px',
		},

		'& .ss__facet-slider__tick': {
			'&:before': {
				content: "''",
				position: 'absolute',
				left: '0',
				background: 'rgba(0, 0, 0, 0.2)',
				height: '5px',
				width: '2px',
				transform: 'translate(-50%, 0.7rem)',
			},
			'& .ss__facet-slider__tick__label': {
				position: 'absolute',
				fontSize: '0.6rem',
				color: tickTextColor,
				top: '100%',
				transform: 'translate(-50%, 1.2rem)',
				whiteSpace: 'nowrap',
			},
		},
		'& .ss__facet-slider__rail': {
			background: railColor || variables?.color?.secondary || '#333',
			height: '100%',
		},
		'& .ss__facet-slider__segment': {
			background: trackColor || '#f2f2f2',
			height: '100%',
		},
		'& .ss__facet-slider__handles': {
			textAlign: 'center',
			'& button': {
				'& .ss__facet-slider__handle': {
					background: handleColor || variables?.color?.secondary || '#333',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '1.6rem',
					height: '1.6rem',
					borderRadius: '100%',
					fontSize: '0.7rem',
					whiteSpace: 'nowrap',
					color: valueTextColor || variables?.color?.secondary || 'initial',
					fontWeight: 'normal',
					transform: 'translateY(0) scale(0.9)',
					transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
					position: 'relative',
					cursor: 'pointer',

					'&:after': {
						backgroundColor: variables?.color?.accent || '#ffffff',
						width: '30%',
						height: '30%',
						top: '0',
						bottom: '0',
						left: '0',
						content: '""',
						position: 'absolute',
						right: '0',
						borderRadius: '12px',
						margin: 'auto',
						cursor: 'pointer',
					},

					'&.ss__facet-slider__handle--active': {
						background: handleDraggingColor || handleColor || variables?.color?.active?.background || '#000',
						'& label.ss__facet-slider__handle__label': {
							background: '#fff',
							padding: '0 5px',
						},
						'&:after': {
							backgroundColor: variables?.color?.active?.foreground || '#ffffff',
						},
					},

					'& label.ss__facet-slider__handle__label': {
						display: 'inline-block',
						marginTop: showTicks && !stickyHandleLabel ? '35px' : '20px',

						'&.ss__facet-slider__handle__label--pinleft': {
							left: '0px',
						},
						'&.ss__facet-slider__handle__label--pinright': {
							right: '0px',
						},
						'&.ss__facet-slider__handle__label--sticky': {
							position: 'absolute',
							top: '-20px',
							fontFamily: 'Roboto, Helvetica, Arial',
							fontSize: '14px',
							marginTop: '0px',
						},
					},
				},
			},
		},

		'& .ss__facet-slider__labels': {
			textAlign: 'center',
			marginTop: showTicks && !stickyHandleLabel ? '40px' : '20px',
			color: variables?.color?.secondary || valueTextColor,

			'& .ss__facet-slider__label--0': {
				'&:after': {
					content: '"-"',
					padding: '5px',
				},
			},
		},
	});
};

// FacetSlider component props
export const facetSlider: Partial<FacetSliderProps> = {
	styleScript: facetSliderStyleScript,
};
