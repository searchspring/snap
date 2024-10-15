import { css } from '@emotion/react';
import type { AutocompleteProps } from '../../../../components/Templates/Autocomplete';

// CSS in JS style script for the Autocomplete component
const autocompleteStyleScript = ({
	inputViewportOffsetBottom,
	hideFacets,
	horizontalTerms,
	noResults,
	contentSlotExists,
	viewportMaxHeight,
	vertical,
	width,
	theme,
}: AutocompleteProps & { inputViewportOffsetBottom: number; noResults: boolean; contentSlotExists: boolean }) => {
	const variables = theme?.variables;

	return css({
		'&, & *, & *:before, & *:after': {
			boxSizing: 'border-box',
		},

		display: 'flex',
		flexDirection: vertical ? 'column' : 'row',
		flexWrap: horizontalTerms && !vertical ? 'wrap' : undefined,
		position: 'absolute',
		zIndex: '10002',
		border: '1px solid #ebebeb',
		background: '#ffffff',
		width: width,
		maxWidth: '100vw',
		maxHeight: viewportMaxHeight && inputViewportOffsetBottom ? `calc(100vh - ${inputViewportOffsetBottom + 10}px)` : undefined,
		overflowY: viewportMaxHeight && horizontalTerms && !vertical ? 'scroll' : undefined,

		'&.ss__autocomplete--only-terms': {
			width: `${vertical || horizontalTerms || contentSlotExists ? width : '150px'}`,
		},

		'.ss__autocomplete__title--trending, .ss__autocomplete__title--history, .ss__autocomplete__title--terms': {
			fontWeight: 'normal',
			margin: 0,
			color: variables?.colors?.secondary || '#c5c5c5',
			textTransform: 'uppercase',
			padding: '10px',
			h5: {
				margin: 0,
			},
		},

		'.ss__autocomplete__title--facets': {
			order: vertical ? 2 : undefined,
		},

		'.ss__autocomplete__terms': {
			display: 'flex',
			flexDirection: 'column',
			flex: `1 1 auto`,
			maxWidth: `${vertical || horizontalTerms ? 'auto' : '150px'}`,
			minWidth: '150px',
			order: 1,
			background: '#fff',
			borderBottom: vertical ? `1px solid ${variables?.colors?.primary || '#333'}` : undefined,

			'.ss__autocomplete__terms__options': {
				display: vertical || horizontalTerms ? 'flex' : undefined,
				flexWrap: 'wrap',

				'.ss__autocomplete__terms__option': {
					textAlign: vertical || horizontalTerms ? 'center' : undefined,
					wordBreak: 'break-all',

					a: {
						display: 'block',
						padding: '5px 10px',
						color: variables?.colors?.secondary,

						em: {
							fontStyle: 'normal',
						},
					},

					'&.ss__autocomplete__terms__option--active': {
						a: {
							fontWeight: 'bold',
						},
					},
				},
			},
		},

		'.ss__facet__header, h5': {
			color: variables?.colors?.primary,
			textTransform: 'uppercase',
			margin: '0 0 20px 0',
			lineHeight: 1.2,
			fontSize: '14px',
		},

		'.ss__autocomplete__facets': {
			display: 'flex',
			flex: `0 0 150px`,
			flexDirection: vertical ? 'row' : 'column',
			columnGap: '20px',
			order: 2,
			padding: vertical ? '10px 20px' : '10px',
			overflowY: vertical ? undefined : 'auto',

			'.ss__facets': {
				display: 'flex',
				flexDirection: vertical ? 'row' : 'column',
				columnGap: '20px',
			},

			'.ss__facet': {
				margin: vertical ? '0 20px 0 0' : undefined,
				flex: vertical ? '0 1 150px' : undefined,
			},

			'.ss__facet-palette-options, .ss__facet-grid-options': {
				gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
			},

			'.ss__facet__options': {
				maxHeight: '250px',
			},

			'.ss__facet-list-options__option__value': {
				textAlign: 'left',
			},
			'.ss__facet-hierarchy-options__option.ss__facet-hierarchy-options__option--filtered~.ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)':
				{
					paddingLeft: 0,
				},
			'.ss__facet-hierarchy-options__option.ss__facet-hierarchy-options__option--filtered:hover': {
				cursor: 'pointer',
			},
			'.ss__facet-palette-options__icon': {
				display: 'none',
			},
		},
		'.ss__autocomplete__content': {
			display: 'flex',
			flex: `1 1 ${hideFacets ? 'auto' : '0%'}`,
			flexDirection: 'column',
			justifyContent: 'space-between',
			order: 3,
			overflowY: 'auto',
			margin: noResults ? '0 auto' : undefined,
			padding: vertical ? '10px 20px' : '10px',

			'.ss__banner.ss__banner--header, .ss__banner.ss__banner--banner': {
				marginBottom: '10px',
			},
			'.ss__banner.ss__banner--footer': {
				margin: '10px 0',
			},
			'.ss__autocomplete__content__results': {
				minHeight: '0%',
			},
			'.ss__autocomplete__content__info': {
				padding: '10px',
				textAlign: noResults ? 'center' : 'right',

				a: {
					fontWeight: 'bold',
					textTransform: 'uppercase',
					color: variables?.colors?.primary,

					'.ss__icon': {
						marginLeft: '5px',
					},
				},
			},
		},
	});
};

// Autocomplete component props
export const autocomplete: Partial<AutocompleteProps> = {
	styleScript: autocompleteStyleScript,
	trendingTitle: 'Popular',
	theme: {
		components: {
			facet: {
				limit: 6,
				disableOverflow: true,
				disableCollapse: true,
			},
			facets: {
				limit: 2,
			},
			facetGridOptions: {
				columns: 3,
			},
			facetHierarchyOptions: {
				hideCount: true,
			},
			facetListOptions: {
				hideCheckbox: true,
				hideCount: true,
			},
			facetPaletteOptions: {
				hideLabel: true,
				columns: 3,
			},
			results: {
				columns: 2,
				rows: 1,
			},
			result: {
				hideBadge: true,
			},
		},
	},
};
