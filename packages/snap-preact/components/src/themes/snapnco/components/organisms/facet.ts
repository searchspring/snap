import { css } from '@emotion/react';
import type { FacetProps } from '../../../../components/Organisms/Facet';

// CSS in JS style script for the Facet component
const facetStyleScript = ({ color, theme }: FacetProps) => {
	const variables = theme?.variables;

	return css({
		'& .ss__facet__dropdown': {
			'& .ss__facet__dropdown__icon': {
				transition: 'transform ease .5s',
			},
			'&.ss__dropdown--open': {
				'& .ss__facet__dropdown__icon': {
					transition: 'transform ease .5s',
					transform: 'rotate(180deg)',
				},
			},
		},
		'&.ss__facet--collapsed': {
			marginBottom: '10px',
			'& .ss__facet__header': {
				fontWeight: 'initial',
				fontSize: '12px',
				borderBottom: '0px',
			},
		},

		'&:not(.ss__facet--collapsed):first-of-type': {
			paddingTop: '0px',
			'& .ss__facet__header': {
				borderTop: '0px',
			},
		},

		'&:not(.ss__facet--collapsed)': {
			paddingTop: '10px',
			'& .ss__facet__header': {
				fontWeight: 'bold',
				fontSize: '20px',
				borderBottom: '0px',
				borderTop: '1px solid #d6d6d6',
				paddingTop: '20px',
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
					borderBottom: '1px solid #d6d6d6',
				},
			},
		},
	});
};

// Facet component props
export const facet: ThemeComponent<'facet', FacetProps> = {
	default: {
		props: {
			themeStyleScript: facetStyleScript,
			iconCollapse: 'angle-down',
			iconExpand: 'angle-right',
			iconOverflowMore: undefined,
			iconOverflowLess: undefined,
			showMoreText: 'View More',
			showLessText: 'View Less',
		},
	},
};
