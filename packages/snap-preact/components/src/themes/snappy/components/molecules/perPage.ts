import { css } from '@emotion/react';
import type { PerPageProps } from '../../../../components/Molecules/PerPage';

// CSS in JS style script for the PerPage component
const perPageStyleScript = ({ theme }: PerPageProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__button__content': {
			gap: '7px',
		},
		'.ss__dropdown .ss__select__dropdown__button': {
			fontWeight: 'initial',
		},
	});
};

// PerPage component props
export const perPage: ThemeComponentProps<PerPageProps> = {
	default: {
		themeStyleScript: perPageStyleScript,
		label: '',
		theme: {
			components: {
				icon: {
					size: '12px',
				},
				select: {
					separator: '',
				},
			},
		},
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
