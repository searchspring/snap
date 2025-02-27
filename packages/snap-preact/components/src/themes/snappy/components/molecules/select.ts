import { css } from '@emotion/react';
import type { SelectProps } from '../../../../components/Molecules/Select';
import Color from 'color';

// CSS in JS style script for the Select component
const selectStyleScript = ({ backgroundColor, theme }: SelectProps) => {
	const variables = theme?.variables;
	const transparentSecondary = new Color(theme?.variables?.colors?.secondary).opaquer(0.2);
	return css({
		'.ss__dropdown': {
			'.ss__select__dropdown__button': {
				border: 'none',
				padding: '6px 30px',
				fontWeight: 'bold',
				'&:hover': {
					backgroundColor: 'initial',
					color: variables?.colors?.primary,
					'.ss__icon': {
						fill: variables?.colors?.accent,
						stroke: variables?.colors?.accent,
					},
				},
				'.ss__select__dropdown__button__icon': {
					marginLeft: '5px',
					transition: 'transform 0.25s ease 0s',
				},
			},
			'&.ss__dropdown--open': {
				'.ss__dropdown__button': {
					boxShadow: '0 6px 12px 1px #0000001f',
					borderTopLeftRadius: '3px',
					borderTopRightRadius: '3px',
					'.ss__select__dropdown__button__icon': {
						transform: 'rotate(180deg)',
					},
				},
				'.ss__dropdown__content': {
					backgroundColor: backgroundColor || '#fff',
					boxShadow: '0 6px 12px 1px #0000001f',
					borderBottomLeftRadius: '3px',
					borderBottomRightRadius: '3px',
					zIndex: '10000',
				},
			},
		},

		'.ss__button__content': {
			gap: '7px',
		},

		'.ss__select__select': {
			border: '0px',
			marginBottom: '0px',

			'.ss__select__select__option': {
				listStyle: 'none',
				padding: '6px 30px',
				gap: '6px',
				color: variables?.colors?.secondary,
				'&.ss__select__select__option--selected': {
					backgroundColor: `${transparentSecondary.rgb().lightness(95)}` || `rgba(109,113,117,.06)`,
				},
				'&:hover': {
					backgroundColor: `${transparentSecondary.rgb().lightness(95)}` || `rgba(109,113,117,.06)`,
				},
			},
		},
	});
};

// Select component props
export const select: ThemeComponentProps<SelectProps> = {
	default: {
		themeStyleScript: selectStyleScript,
		iconClose: 'angle-down',
		iconOpen: 'angle-down',
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
