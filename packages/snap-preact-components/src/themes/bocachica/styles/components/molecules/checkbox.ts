import { css, CheckboxProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Checkbox component
const checkboxStyleScript = ({ size, color, theme }: CheckboxProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: size,
		width: size,
		border: `1px solid ${color || variables?.color?.secondary || '#333'}`,
		borderRadius: '3px',
		'&.ss__checkbox--disabled': {
			opacity: 0.7,
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
