import { css, ButtonProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Button component
const buttonStyleScript = ({ color, backgroundColor, borderColor, theme }: ButtonProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'inline-flex',
		padding: '5px 10px',
		position: 'relative',
		color: color || variables?.color?.secondary,
		outline: 0,
		backgroundColor: backgroundColor || '#fff',
		border: `1px solid ${borderColor || variables?.color?.accent || '#333'}`,
		borderRadius: '3px',
		'&:hover': {
			cursor: 'pointer',
			backgroundColor: variables?.color?.hover?.background,
			color: variables?.color?.hover?.foreground,
			borderColor: borderColor || variables?.color?.hover?.accent,
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
