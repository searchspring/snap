import { css, PaginationProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Pagination component
const paginationStyleScript = ({ theme }: PaginationProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		'& .ss__pagination__page': {
			padding: '5px',
			display: 'inline-block',
			minHeight: '1em',
			minWidth: '1em',
			textAlign: 'center',
			color: variables?.color?.text,

			'&.ss__pagination__page--active': {
				fontWeight: 'bold',
			},
			'&:hover:not(.ss__pagination__page--active)': {
				background: variables.color?.hover?.background,
				color: variables?.color?.hover?.text,
			},
		},
	});
};

// Pagination component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-pagination--default
export const pagination: PaginationProps = {
	styleScript: paginationStyleScript,
};
