import { css } from '@emotion/react';
import type { ButtonProps } from '../../../../components/Atoms/Button';
import { Colour } from '../../../../utilities';

// CSS in JS style script for the Button component
const buttonStyleScript = ({ color, backgroundColor, borderColor, theme }: ButtonProps) => {
	const variables = theme?.variables;
	const borderColour = new Colour(borderColor || variables?.colors.primary);
	const colour = new Colour(color || variables?.colors.primary);
	const hoverBackgroundColour = new Colour(backgroundColor || variables?.colors.primary);

	return css({
		display: 'inline-flex',
		padding: '5px 10px',
		position: 'relative',
		color: colour.hex,
		outline: 0,
		backgroundColor: '#fff',
		border: `1px solid ${borderColour.hex}`,
		borderRadius: '3px',
		'&:not(.ss__button--disabled):hover': {
			cursor: 'pointer',
			backgroundColor: hoverBackgroundColour.hex,
			color: hoverBackgroundColour.contrast,
			'.ss__icon': {
				fill: hoverBackgroundColour.contrast,
				stroke: hoverBackgroundColour.contrast,
			},
		},
		'&.ss__button--disabled': {
			opacity: 0.3,
			backgroundColor: 'initial',
			'&:hover': {
				cursor: 'default',
			},
		},
		'.ss__icon': {
			marginLeft: '10px',
		},
		'.ss__button__content': {
			width: '100%',
		},
	});
};

// Button component props
export const button: Partial<ButtonProps> = {
	styleScript: buttonStyleScript,
};
