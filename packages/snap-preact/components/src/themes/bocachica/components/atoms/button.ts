import { css } from '@emotion/react';
import type { ButtonProps } from '../../../../components/Atoms/Button';
import Color from 'color';

// CSS in JS style script for the Button component
const buttonStyleScript = ({ color, backgroundColor, borderColor, theme }: ButtonProps) => {
	const variables = theme?.variables;
	const borderColour = new Color(borderColor || color || variables?.colors.primary);
	const colour = new Color(color || variables?.colors.primary);
	const hoverBackgroundColour = new Color(backgroundColor || color || variables?.colors.primary);
	const hoverColour = hoverBackgroundColour.isDark() ? '#fff' : '#000';

	return css({
		display: 'inline-flex',
		padding: '5px 10px',
		position: 'relative',
		color: colour.hex(),
		outline: 0,
		backgroundColor: '#fff',
		border: `1px solid ${borderColour.hex()}`,
		borderRadius: '3px',
		'&:not(.ss__button--disabled):hover': {
			cursor: 'pointer',
			backgroundColor: hoverBackgroundColour.hex(),
			color: hoverColour,
			'.ss__icon': {
				fill: hoverColour,
				stroke: hoverColour,
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
