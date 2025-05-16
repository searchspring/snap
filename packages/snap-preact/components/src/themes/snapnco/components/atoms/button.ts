import { css } from '@emotion/react';
import type { ButtonProps } from '../../../../components/Atoms/Button';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Button component
const buttonStyleScript = ({}: ButtonProps) => {
	return css({
		backgroundColor: '#fff',
		borderRadius: '.5em',
		padding: '13px 15px',
		color: '#5c5c5c',
		border: `1px solid #e6e6e6`,

		'.ss__icon': {
			fill: '#5C5C5C',
			stroke: '#5C5C5C',
		},

		'&:not(.ss__button--disabled):hover': {
			opacity: 0.7,
			backgroundColor: '#fff',

			'.ss__icon': {
				fill: '#5C5C5C',
				stroke: '#5C5C5C',
			},
		},
	});
};

// Button component props
export const button: ThemeComponent<'button', ButtonProps> = {
	default: {
		button: {
			themeStyleScript: buttonStyleScript,
		},
	},
};
