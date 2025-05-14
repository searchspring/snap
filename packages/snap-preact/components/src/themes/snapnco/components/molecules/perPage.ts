import { css } from '@emotion/react';
import type { PerPageProps } from '../../../../components/Molecules/PerPage';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the PerPage component
const perPageStyleScript = ({ theme }: PerPageProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__dropdown .ss__select__dropdown__button': {
			fontWeight: 'normal',
			color: '#666666',
			'.ss__select__selection': {
				color: 'black',
			},
		},
	});
};

// PerPage component props
export const perPage: ThemeComponent<'perPage', PerPageProps> = {
	default: {
		props: {
			themeStyleScript: perPageStyleScript,
		},
		components: {
			'*perPage icon': {
				size: '12px',
				icon: 'angle-down',
			},
		},
	},
	mobile: {
		components: {
			'*perPage select': {
				hideSelection: true,
			},
		},
	},
};
