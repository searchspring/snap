import { css } from '@emotion/react';
import type { PerPageProps } from '../../../../components/Molecules/PerPage';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the PerPage component
const perPageStyleScript = ({ theme }: PerPageProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__button__content': {
			gap: '7px',
		},
		'.ss__dropdown.ss__dropdown--open': {
			'.ss__dropdown__button': {
				boxShadow: 'none',
			},
		},
		'.ss__dropdown': {
			'.ss__dropdown__content': {
				width: 'max-content',
			},
			'.ss__select__dropdown__button': {
				background: '#e6e6e6',
				borderRadius: '25px',
				fontWeight: 'initial',
				padding: '10px 5px 10px 15px',
				boxShadow: 'none',

				'&:hover': {
					background: '#e6e6e6',
				},

				'.ss__select__dropdown__button__icon': {
					background: 'white',
					padding: '5px',
					borderRadius: '50%',
					marginLeft: '15px',
				},
			},
		},

		[`@media (max-width: ${variables?.breakpoints.tablet}px)`]: {
			'.ss__button__content': {
				padding: '5px 10px',
			},
		},
	});
};

// PerPage component props
export const perPage: ThemeComponent<'perPage', PerPageProps> = {
	default: {
		perPage: {
			themeStyleScript: perPageStyleScript,
			label: '',
		},
		'perPage icon': {
			size: '12px',
		},
	},
	mobile: {
		'perPage select': {
			separator: '',
		},
	},
};
