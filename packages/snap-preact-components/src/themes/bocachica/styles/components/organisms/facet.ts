import { css, FacetProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Facet component
const facetStyleScript = ({ color, theme }: FacetProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		width: '100%',
		margin: '0 0 20px 0',
		'& .ss__facet__dropdown': {
			'& .ss__facet__dropdown__icon': {
				transition: 'transform ease .5s',
			},
			'&.ss__dropdown--open': {
				'& .ss__facet__dropdown__icon': {
					transform: 'rotate(180deg)',
				},
			},
		},
		'& .ss__facet__header': {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			color: color || variables?.color?.text,
			fontWeight: 'bold',
			padding: '6px 0',
		},
		'& .ss__facet__options': {
			marginTop: '8px',
			maxHeight: '400px',
			overflowY: 'auto',
			overflowX: 'hidden',

			'&::-webkit-scrollbar': {
				width: '10px',
			},
			'&::-webkit-scrollbar-track': {
				background: variables?.color?.secondary,
				borderRadius: '10px',
			},
			'&::-webkit-scrollbar-thumb': {
				background: variables?.color?.primary,
				borderRadius: '10px',
			},
			'&::-webkit-scrollbar-thumb:hover': {
				background: variables?.color?.hover?.background,
			},
		},
		'& .ss__facet__show-more-less': {
			display: 'block',
			margin: '8px',
			cursor: 'pointer',
			color: color || variables?.color?.text,
			'& .ss__icon': {
				marginRight: '8px',
			},
		},
		'& .ss__search-input': {
			margin: '16px 0 0 0',
		},
	});
};

// Facet component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/organisms-facet--grid
export const facet: Omit<FacetProps, 'facet'> = {
	styleScript: facetStyleScript,
	iconCollapse: 'angle-down',
	iconExpand: 'angle-down',
	iconOverflowMore: 'plus-thin',
	iconOverflowLess: 'minus',
};
