import { css, ListProps } from '../../../../../index';

// CSS in JS style script for the List component
const listStyleScript = ({ horizontal, theme }: ListProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__list__options-wrapper': {
			border: 'none',
			listStyle: 'none',
			padding: '0px',
			margin: '0px',
			display: `${horizontal ? 'flex' : 'initial'}`,
		},

		'.ss__list__title': {
			margin: '0px',
			padding: '5px',
		},

		'.ss__list__option': {
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			padding: '5px',

			'& .ss__list__option__label , .ss__list__option__icon': {
				cursor: 'pointer',
				padding: '0px 0px 0px 5px',
			},
		},

		'&.ss__list--disabled, .ss__list__option--disabled': {
			cursor: 'none',
			pointerEvents: 'none',
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
