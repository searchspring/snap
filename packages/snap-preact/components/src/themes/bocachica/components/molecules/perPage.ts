import { css } from '@emotion/react';
import type { PerPageProps } from '../../../../components/Molecules/PerPage';

// CSS in JS style script for the PerPage component
const perPageStyleScript = ({ theme }: PerPageProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__button__content': {
			display: 'flex',
			gap: '7px',
		},
	});
};

// PerPage component props
export const perPage: Partial<PerPageProps> = {
	styleScript: perPageStyleScript,
	theme: {
		components: {
			icon: {
				size: '12px',
			},
		},
	},
};
