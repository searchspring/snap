import { css, SelectProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Select component
const selectStyleScript = ({ color, backgroundColor, borderColor, theme }: SelectProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'inline-flex',
		color: color,
		'&.ss__select--disabled': {
			opacity: 0.7,
		},
		'& .ss__select__dropdown__button__icon': {
			margin: 'auto 0 auto 5px',
		},
		'& .ss__select__label': {
			marginRight: '5px',
		},
		'& .ss__select__select': {
			position: 'relative',
			zIndex: '10000',
			backgroundColor: backgroundColor || '#fff',
			listStyle: 'none',
			padding: '0',
			marginTop: '-1px',
			border: `1px solid ${borderColor || color || variables?.color?.primary || '#333'}`,
			'& .ss__select__select__option': {
				cursor: 'pointer',
				padding: '6px 8px',
				color: 'initial',
				'&.ss__select__select__option--selected': {
					fontWeight: 'bold',
				},
				'&:hover': {
					backgroundColor: variables?.color?.hover || '#f8f8f8',
				},
			},
		},
	});
};

// Select component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-select--default
export const select: Omit<SelectProps, 'options'> = {
	styleScript: selectStyleScript,
};
