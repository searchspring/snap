import { css } from '@emotion/react';
import type { SelectProps } from '../../../../../components/Molecules/Select';

// CSS in JS style script for the Select component
const selectStyleScript = ({ color, backgroundColor, borderColor, theme }: SelectProps) => {
	const variables = theme?.variables;

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
				fontWeight: 'bold',
				'&:hover': {
					backgroundColor: 'initial',
					color: variables?.color?.secondary || 'unset',
				},
				'& .ss__select__dropdown__button__icon': {
					transition: 'transform 0.25s ease 0s',
				},
			},
			'&.ss__dropdown--open': {
				'& .ss__dropdown__button': {
					boxShadow: '0 6px 12px 1px #0000001f',
					'& .ss__select__dropdown__button__icon': {
						transform: 'rotate(180deg)',
					},
				},
				'& .ss__dropdown__content': {
					backgroundColor: backgroundColor || '#fff',
					boxShadow: '0 6px 12px 1px #0000001f',
					zIndex: '10000',
				},
			},
		},

		'& .ss__select__select': {
			position: 'relative',
			padding: '0',
			margin: '-1px 0 0 0',
			border: borderColor ? `1px solid ${borderColor || color}` : '',
			'& .ss__select__select__option': {
				listStyle: 'none',
				cursor: 'pointer',
				padding: '6px 30px',
				color: variables?.color?.secondary,
				'&.ss__select__select__option--selected': {
					background: `rgba(109,113,117,.06)`,
				},
				'&:hover': {
					background: `rgba(109,113,117,.06)`,
				},
			},
		},
	});
};

// Select component props
export const select: Partial<SelectProps> = {
	styleScript: selectStyleScript,
	iconClose: 'angle-down',
	iconOpen: 'angle-down',
};
