import { css } from '@emotion/react';
import type { ListProps } from '../../../../components/Molecules/List';
import { ThemeComponent } from '../../../../providers';

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
export const list: ThemeComponent<'list', ListProps> = {
	default: {
		props: {
			themeStyleScript: listStyleScript,
		},
		components: {
			'*list icon': {
				size: '24px',
			},
		},
	},
};
