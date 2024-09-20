import { css } from '@emotion/react';
import type { FacetProps } from '../../../../components/Organisms/Facet';

// CSS in JS style script for the Facet component
const facetStyleScript = ({ color, theme }: FacetProps) => {
	const variables = theme?.variables;

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
			color: color || variables?.colors?.secondary,
			fontWeight: 'bold',
		},
		'& .ss__facet__options': {
			marginTop: '8px',
			maxHeight: '400px',
			overflowY: 'auto',
			overflowX: 'hidden',

			'&::-webkit-scrollbar': {
				width: '8px',
			},
			'&::-webkit-scrollbar-track': {
				background: '#f2f2f2',
			},
			'&::-webkit-scrollbar-thumb': {
				background: variables?.colors?.secondary || '#ccc',
			},
		},
		'& .ss__facet__show-more-less': {
			display: 'block',
			margin: '8px',
			cursor: 'pointer',
			color: color || variables?.colors?.secondary,
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
export const facet: Partial<FacetProps> = {
	styleScript: facetStyleScript,
	iconCollapse: 'angle-down',
	iconExpand: 'angle-down',
	iconOverflowMore: 'plus-thin',
	iconOverflowLess: 'minus',
};
