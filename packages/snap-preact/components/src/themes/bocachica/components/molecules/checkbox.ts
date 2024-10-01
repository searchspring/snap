import { css } from '@emotion/react';
import type { CheckboxProps } from '../../../../components/Molecules/Checkbox';
import { Colour } from '../../../../utilities';

// CSS in JS style script for the Checkbox component
const checkboxStyleScript = ({ size, color, theme }: CheckboxProps) => {
	const variables = theme?.variables;
	const backgroundColor = new Colour(color || variables?.colors.primary);

	return css({
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: size,
		width: size,
		border: `1px solid ${backgroundColor.hex}`,
		borderRadius: '3px',
		'&.ss__checkbox--active': {
			backgroundColor: backgroundColor.hex,
			'.ss__icon': {
				fill: backgroundColor.contrast,
				stroke: backgroundColor.contrast,
			},
		},
		'&.ss__checkbox--disabled': {
			opacity: 0.3,
		},
		'& .ss__checkbox__empty': {
			display: 'inline-block',
			width: `calc(${size} - 30%)`,
			height: `calc(${size} - 30%)`,
		},
	});
};

// Checkbox component props
export const checkbox: Partial<CheckboxProps> = {
	styleScript: checkboxStyleScript,
	size: '18px',
};
