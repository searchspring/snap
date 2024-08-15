import { css } from '@emotion/react';
import type { ToggleProps } from '../../../../../components/Atoms/Toggle';

// CSS in JS style script for the Toggle component
const toggleStyleScript = ({ activeColor, inactiveColor: deActiveColor, buttonColor, size, theme }: ToggleProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'flex',
		alignItems: 'center',

		'&.ss__toggle--disabled': {
			opacity: '.5',
			cursor: 'none',
			pointerEvents: 'none',
		},

		/* The switch - the box around the slider */
		'& .ss__toggle__switch': {
			position: 'relative',
			display: 'inline-block',
			width: size,
			height: `calc(${size} / 2 + 4px)`,
			margin: '10px',
		},

		/* Hide default HTML checkbox */
		'& .ss__toggle__switch input': {
			opacity: '0',
			width: '0',
			height: '0',
		},

		/* The slider */
		'& .ss__toggle__slider-box': {
			position: 'absolute',
			cursor: 'pointer',
			top: '0',
			left: '0',
			right: '0',
			bottom: '0',
			backgroundColor: `${deActiveColor}`,
			transition: '.4s',
		},

		'.ss__toggle__slider': {
			position: 'absolute',
			content: "''",
			height: `calc(${size} / 2 - 4px)`,
			width: `calc(${size} / 2 - 4px)`,
			left: '4px',
			bottom: '4px',
			backgroundColor: `${buttonColor}`,
			transition: '.4s',
			zIndex: 1,
		},

		'& .ss__toggle__switch--filtered .ss__toggle__slider-box': {
			backgroundColor: `${activeColor}`,
		},

		'& .ss__toggle__switch--filtered .ss__toggle__slider-box .ss__toggle__slider': {
			transform: `translateX(calc(${size} / 2 - 4px))`,
		},

		/* Rounded sliders */
		'& .ss__toggle__slider-box.ss__toggle__slider-box--round': {
			borderRadius: `calc(${size} * 2)`,
		},

		'& .ss__toggle__slider.ss__toggle__slider--round': {
			borderRadius: `calc(${size} / 2)`,
		},
	});
};

// Toggle component props
export const toggle: Partial<ToggleProps> = {
	styleScript: toggleStyleScript,
};
