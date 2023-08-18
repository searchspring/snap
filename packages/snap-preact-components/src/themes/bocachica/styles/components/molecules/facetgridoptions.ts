import { css, FacetGridOptionsProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the FacetGridOptions component
const facetGridOptionsStyleScript = ({ columns, gapSize, theme }: FacetGridOptionsProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'flex',
		flexFlow: 'row wrap',
		gridTemplateColumns: `repeat(${columns}, 1fr)`,
		gap: gapSize,
		gridAutoRows: `1fr`,

		'& .ss__facet-grid-options__option': {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flex: '0 1 auto',
			border: `1px solid ${variables?.color?.primary || '#333'}`,
			textAlign: 'center',
			wordBreak: 'break-all',
			boxSizing: 'border-box',
			padding: '1em 0',
			width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px)`,
			margin: `0 ${gapSize} ${gapSize} 0`,

			[`:nth-of-type(${columns}n)`]: {
				marginRight: '0',
			},
			'&.ss__facet-grid-options__option--filtered': {
				background: variables?.color?.primary || '#ccc',
				color: variables?.color?.text?.secondary,
			},
			'&:hover:not(.ss__facet-grid-options__option--filtered)': {
				cursor: 'pointer',
				background: variables?.color?.hover || '#f8f8f8',
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
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-facetgridoptions--default
export const facetGridOptions: FacetGridOptionsProps = {
	styleScript: facetGridOptionsStyleScript,
};
