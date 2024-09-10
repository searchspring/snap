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
		'&:hover': {
			cursor: 'pointer',
			backgroundColor: variables?.colors?.hover?.background,
			color: variables?.colors?.hover?.foreground,
			borderColor: borderColor || variables?.colors?.hover?.accent,
		},
		'&.ss__button--disabled': {
			opacity: 0.7,
			borderColor: 'rgba(51,51,51,0.7)',
			backgroundColor: 'initial',
			'&:hover': {
				cursor: 'default',
			},
		},
	});
};

// Button component props
export const button: Partial<ButtonProps> = {
	styleScript: buttonStyleScript,
};
