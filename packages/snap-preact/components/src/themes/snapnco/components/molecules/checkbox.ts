import { css } from '@emotion/react';
import type { CheckboxProps } from '../../../../components/Molecules/Checkbox';
import Color from 'color';

// CSS in JS style script for the Checkbox component
const checkboxStyleScript = ({ color, theme }: CheckboxProps) => {
	const variables = theme?.variables;
	const backgroundColorObj = new Color(color || variables?.colors.primary);
	const backgroundTextColorObj = backgroundColorObj.isDark() ? new Color('#fff') : new Color('#000');

	return css({
		border: `2px solid ${backgroundColorObj.hex()}`,
		borderRadius: '3px',
		'&.ss__checkbox--active': {
			backgroundColor: backgroundColorObj.hex(),
			'.ss__icon': {
				fill: backgroundTextColorObj.hex(),
				stroke: backgroundTextColorObj.hex(),
			},
		},
		'&.ss__checkbox--disabled': {
			opacity: 0.3,
		},
	});
};

// Checkbox component props
export const checkbox: ThemeComponentProps<CheckboxProps> = {
	default: {
		themeStyleScript: checkboxStyleScript,
		size: '18px',
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
