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
		border: `1px solid ${color || variables?.color?.primary || '#333'}`,
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
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-checkbox--default
export const checkbox: CheckboxProps = {
	styleScript: checkboxStyleScript,
};
