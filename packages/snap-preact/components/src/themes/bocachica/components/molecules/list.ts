import { css } from '@emotion/react';
import type { ListProps } from '../../../../components/Molecules/List';

// CSS in JS style script for the List component
const listStyleScript = ({ theme }: ListProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		gap: '8px',

		'& .ss__list__options': {
			gap: '10px',
		},
	});
};

// List component props
export const list: ThemeComponentProps<ListProps> = {
	default: {
		themeStyleScript: listStyleScript,
		theme: {
			components: {
				icon: {
					size: '24px',
				},
			},
		},
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
