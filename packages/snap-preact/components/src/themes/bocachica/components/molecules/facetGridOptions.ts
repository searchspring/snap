import { css } from '@emotion/react';
import type { FacetGridOptionsProps } from '../../../../components/Molecules/FacetGridOptions';

// CSS in JS style script for the FacetGridOptions component
const facetGridOptionsStyleScript = ({ columns, gapSize, gridSize, theme }: FacetGridOptionsProps) => {
	const variables = theme?.variables;

	return css({
		display: 'flex',
		flexFlow: 'row wrap',
		gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : `repeat(auto-fill, minmax(${gridSize}, 1fr))`,
		color: variables?.colors?.secondary,
		gap: gapSize,
		gridAutoRows: `1fr`,

		'& .ss__facet-grid-options__option': {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flex: '0 1 auto',
			border: `1px solid ${variables?.colors?.secondary || '#333'}`,
			borderRadius: '3px',
			textAlign: 'center',
			wordBreak: 'break-all',
			boxSizing: 'border-box',
			padding: '1em 0',
			width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px)`,
			margin: `0 ${gapSize} ${gapSize} 0`,
			color: variables?.colors?.secondary,

			[`:nth-of-type(${columns}n)`]: {
				marginRight: '0',
			},
			'&.ss__facet-grid-options__option--filtered': {
				background: variables?.colors?.active?.background || '#ccc',
				color: variables?.colors?.active?.foreground,
			},
			'&:hover:not(.ss__facet-grid-options__option--filtered)': {
				cursor: 'pointer',
			},
			'& .ss__facet-grid-options__option__value': {
				'&.ss__facet-grid-options__option__value--smaller': {
					fontSize: '70%',
				},
			},
		},

		'@supports (display: grid)': {
			display: 'grid',

			'& .ss__facet-grid-options__option': {
				padding: '0',
				margin: '0',
				width: 'initial',
			},
			'&::before': {
				content: '""',
				width: 0,
				paddingBottom: '100%',
				gridRow: '1 / 1',
				gridColumn: '1 / 1',
			},
			'&> *:first-of-type': {
				gridRow: '1 / 1',
				gridColumn: '1 / 1',
			},
		},
	});
};

// FacetGridOptions component props
export const facetGridOptions: Partial<FacetGridOptionsProps> = {
	styleScript: facetGridOptionsStyleScript,
	gapSize: '5px',
	columns: 5,
};
