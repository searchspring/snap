import { css } from '@emotion/react';
import type { FacetProps } from '../../../../components/Organisms/Facet';

// CSS in JS style script for the Facet component
const facetStyleScript = ({ color, theme }: FacetProps) => {
	const variables = theme?.variables;

	return css({
		'& .ss__facet__dropdown': {
			background: ' #f8f8f8',
			padding: '20px',
			borderRadius: '30px',

			'& .ss__facet__dropdown__icon': {
				transition: 'transform ease .5s',
			},
			'&.ss__dropdown--open': {
				'& .ss__facet__dropdown__icon': {
					transition: 'transform ease .5s',
					transform: 'rotate(180deg)',
				},
			},
			'.ss__dropdown__content': {
				background: '#f8f8f8',
			},
		},
		'& .ss__facet__header': {
			fontWeight: 'initial',
			borderBottom: '0px',
		},
		'& .ss__facet__options': {
			maxHeight: '400px',

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
			margin: '8px 5px',
			textAlign: 'center',
			color: color || variables?.colors?.secondary,

			span: {
				borderBottom: '1px solid #ccc',
			},
		},
	});
};

// Facet component props
export const facet: ThemeComponentProps<FacetProps> = {
	default: {
		themeStyleScript: facetStyleScript,
		iconCollapse: 'angle-down',
		iconExpand: 'angle-down',
		iconOverflowMore: undefined,
		iconOverflowLess: undefined,
		showMoreText: 'View More',
		showLessText: 'View Less',
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
