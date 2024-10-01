import { css } from '@emotion/react';
import type { ListProps } from '../../../../components/Molecules/List';

// CSS in JS style script for the List component
const listStyleScript = ({ horizontal, theme }: ListProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'flex',
		flexDirection: horizontal ? 'row' : 'column',
		alignItems: horizontal ? 'center' : undefined,
		justifyItems: 'flex-start',

		'& .ss__list__options': {
			border: 'none',
			listStyle: 'none',
			padding: '0px',
			margin: '0px',
			display: 'flex',
			flexDirection: horizontal ? 'row' : 'column',
			alignItems: horizontal ? 'center' : undefined,
			justifyItems: 'flex-start',
			gap: '8px',
		},

		'.ss__list__option': {
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			gap: '5px',

			'& .ss__list__option__label , .ss__list__option__icon': {
				cursor: 'pointer',
			},
		},

		'&.ss__list--disabled, .ss__list__option--disabled': {
			cursor: 'none',
			pointerEvents: 'none',
			opacity: 0.5,
		},

		'&.ss__list--disabled, .ss__list__option--unavailable': {
			cursor: 'pointer',
			opacity: 0.5,
		},

		'.ss__list__option--selected': {
			fontWeight: 'bold',
		},
	});
};

// List component props
export const list: Partial<ListProps> = {
	styleScript: listStyleScript,
};
