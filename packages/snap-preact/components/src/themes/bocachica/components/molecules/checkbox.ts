import { css } from '@emotion/react';
import type { CheckboxProps } from '../../../../components/Molecules/Checkbox';
import Color from 'color';

// CSS in JS style script for the Checkbox component
const checkboxStyleScript = ({ size, color, theme }: CheckboxProps) => {
	const variables = theme?.variables;
	const backgroundColor = new Color(color || variables?.colors.primary);
	const backgroundTextColor = backgroundColor.isDark() ? '#fff' : '#000';

	return css({
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: size,
		width: size,
		border: `1px solid ${backgroundColor.hex()}`,
		borderRadius: '3px',
		'&.ss__checkbox--active': {
			backgroundColor: backgroundColor.hex(),
			'.ss__icon': {
				fill: backgroundTextColor,
				stroke: backgroundTextColor,
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
	themeStyleScript: checkboxStyleScript,
	size: '18px',
};
