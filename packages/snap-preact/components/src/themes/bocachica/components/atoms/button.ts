import { css } from '@emotion/react';
import type { ButtonProps } from '../../../../components/Atoms/Button';

// CSS in JS style script for the Button component
const buttonStyleScript = ({ color, backgroundColor, borderColor, theme }: ButtonProps) => {
	const variables = theme?.variables;

	return css({
		display: 'inline-flex',
		padding: '5px 10px',
		position: 'relative',
		color: color || variables?.colors?.secondary,
		outline: 0,
		backgroundColor: backgroundColor,
		border: `1px solid ${borderColor || variables?.colors?.accent || '#333'}`,
		borderRadius: '3px',
		'&:not(.ss__button--disabled):hover': {
			cursor: 'pointer',
			backgroundColor: variables?.colors?.hover?.background,
			color: variables?.colors?.hover?.foreground,
			borderColor: borderColor || variables?.colors?.hover?.accent,
			'.ss__icon': {
				fill: variables?.colors?.hover?.foreground,
				stroke: variables?.colors?.hover?.foreground,
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
	});
};

// Button component props
export const button: Partial<ButtonProps> = {
	styleScript: buttonStyleScript,
};
