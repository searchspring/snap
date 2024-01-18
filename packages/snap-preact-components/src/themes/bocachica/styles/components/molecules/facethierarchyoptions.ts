import { css, FacetHierarchyOptionsProps } from '../../../../../index';

// CSS in JS style script for the FacetHierarchyOptions component
const facetHierarchyOptionsStyleScript = ({ horizontal, theme }: FacetHierarchyOptionsProps) => {
	const variables = theme?.variables;

	if (horizontal) {
		return css({
			display: 'flex',
			flexWrap: 'wrap',
			'& .ss__facet-hierarchy-options__option': {
				margin: '0 5px 5px 0',
				color: variables?.color?.secondary,
				flex: '0 1 auto',
				border: `1px solid ${variables?.color?.secondary || '#333'}`,
				padding: '0.5em 0.5em',
				'&.ss__facet-hierarchy-options__option--filtered': {
					fontWeight: 'bold',
					marginRight: '2em',
					backgroundColor: variables?.color?.active?.background,
					color: variables?.color?.active?.foreground,
					'&:hover': {
						cursor: 'default',
					},
				},
				'&.ss__facet-hierarchy-options__option--return': {
					'&:before': {
						content: `'\\0000ab'`,
						padding: '0 2px 0 0',
						color: variables?.color?.accent,
					},
				},
				'& .ss__facet-hierarchy-options__option__value': {
					'& .ss__facet-hierarchy-options__option__value__count': {
						fontSize: '0.8em',
						marginLeft: '6px',
					},
				},
			},
		});
	}

	return css({
		'& .ss__facet-hierarchy-options__option': {
			display: 'flex',
			padding: '6px 0',
			textDecoration: 'none',
			alignItems: 'center',
			color: variables?.color?.secondary,

			'&:hover': {
				cursor: 'pointer',
			},
			'&.ss__facet-hierarchy-options__option--filtered': {
				fontWeight: 'bold',
				'&:hover': {
					cursor: 'default',
				},
				'& ~ .ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)': {
					paddingLeft: '16px',
				},
			},
			'&.ss__facet-hierarchy-options__option--return': {
				'&:before': {
					content: `'\\0000ab'`,
					padding: '0 2px 0 0',
					color: variables?.color?.accent,
				},
			},
			'& .ss__facet-hierarchy-options__option__value': {
				marginLeft: '8px',
				'& .ss__facet-hierarchy-options__option__value__count': {
					fontSize: '0.8em',
					marginLeft: '6px',
				},
			},
		},
	});

	// return css({
	// 	display: horizontal ? 'flex' : undefined,
	// 	flexWrap: horizontal ? 'wrap' : undefined,
	// 	'& .ss__facet-hierarchy-options__option': {
	// 		display: horizontal ? undefined : 'flex',
	// 		padding: horizontal ? '0.5em' : '6px 0',
	// 		textDecoration: horizontal ? undefined : 'none',

	// 		alignItems: horizontal ? undefined : 'center',
	// 		color: variables?.color?.secondary,
	// 		flex: horizontal ? '0 1 auto' : undefined,
	// 		border: horizontal ? `1px solid ${variables?.color?.secondary || '#333'}` : undefined,
	// 		margin: horizontal ? '0 5px 5px 0' : undefined,

	// 		'&:hover': {
	// 			cursor: 'pointer',
	// 		},
	// 		'&.ss__facet-hierarchy-options__option--filtered': {
	// 			fontWeight: 'bold',
	// 			marginRight: horizontal ? '2em' : undefined,
	// 			backgroundColor: horizontal ? variables?.color?.active?.background : undefined,
	// 			color: horizontal ? variables?.color?.active?.foreground : undefined,
	// 			'&:hover': {
	// 				cursor: 'default',
	// 			},
	// 			'& ~ .ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)': {
	// 				paddingLeft: horizontal ? undefined : '16px',
	// 			},
	// 		},
	// 		'&.ss__facet-hierarchy-options__option--return': {
	// 			'&:before': {
	// 				content: `'\\0000ab'`,
	// 				padding: '0 2px 0 0',
	// 				color: variables?.color?.accent,
	// 			},
	// 		},
	// 		'& .ss__facet-hierarchy-options__option__value': {
	// 			marginLeft: horizontal ? undefined : '8px',
	// 			'& .ss__facet-hierarchy-options__option__value__count': {
	// 				fontSize: '0.8em',
	// 				marginLeft: '6px',
	// 			},
	// 		},
	// 	},
	// });
};

// FacetHierarchyOptions component props
export const facetHierarchyOptions: Partial<FacetHierarchyOptionsProps> = {
	styleScript: facetHierarchyOptionsStyleScript,
};
