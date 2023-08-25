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
		'& .ss__dropdown': {
			'& .ss__select__dropdown__button': {
				border: 'none',
				padding: '6px 30px',
			},
			'&.ss__dropdown--open': {
				'& .ss__dropdown__button': {
					boxShadow: '0 6px 12px 1px #0000001f',
				},
				'& .ss__dropdown__content': {
					boxShadow: '0 6px 12px 1px #0000001f',
				},
			},
		},

		'& .ss__select__select': {
			position: 'relative',
			zIndex: '10000',
			backgroundColor: backgroundColor || variables?.color?.background || '#fff',
			listStyle: 'none',
			padding: '0',
			marginTop: '-1px',
			border: borderColor ? `1px solid ${borderColor || color}` : '',
			'& .ss__select__select__option': {
				cursor: 'pointer',
				padding: '6px 30px',
				color: 'initial',
				'&.ss__select__select__option--selected': {
					fontWeight: 'bold',
				},
				'&:hover': {
					background: variables.color?.hover?.background,
					color: variables?.color?.hover?.text,
				},
			},
		},
	});
};

// Select component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-select--default
export const select: Omit<SelectProps, 'options'> = {
	styleScript: selectStyleScript,
	// backgroundColor: 'white',
	// borderColor: 'red',
	theme: {
		components: {
			button: {
				// backgroundColor: 'white',
				// borderColor: 'red',
				// disableStyles: true,
			},
		},
	},
};
