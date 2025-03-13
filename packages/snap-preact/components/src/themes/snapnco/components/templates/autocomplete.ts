import { css } from '@emotion/react';
import type { AutocompleteProps } from '../../../../components/Templates/Autocomplete';

// CSS in JS style script for the Autocomplete component
const autocompleteStyleScript = ({
	horizontalTerms,
	vertical,
	theme,
}: AutocompleteProps & { inputViewportOffsetBottom: number; noResults: boolean }) => {
	const variables = theme?.variables;

	return css({
		background: '#F8F8F8',
		'.ss__autocomplete__title': {
			color: variables?.colors?.secondary || '#c5c5c5',
			h5: {
				fontWeight: 'initial',
			},
		},

		'.ss__autocomplete__terms': {
			borderBottom: vertical ? `1px solid ${variables?.colors?.primary || '#333'}` : undefined,

			'.ss__autocomplete__terms__options': {
				'.ss__autocomplete__terms__option': {
					a: {
						padding: vertical || horizontalTerms ? '10px 30px' : '10px',
						color: variables?.colors?.secondary,
						fontWeight: 'initial',
						em: {
							fontStyle: 'normal',
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
			flex: '0 0 250px',
			'.ss__facet': {
				margin: vertical ? '0 20px 0 0' : undefined,
				flex: vertical ? '0 1 150px' : undefined,
			},

			'.ss__facet-palette-options, .ss__facet-grid-options': {
				// gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
			},

			'.ss__facet__options': {
				maxHeight: '250px',
			},

			'.ss__facet-list-options__option__value': {
				textAlign: 'left',
			},
		},
		'.ss__autocomplete__content': {
			'.ss__autocomplete__content__info': {
				a: {
					textTransform: 'uppercase',
					fontWeight: 'initial',
				},
			},
		},
	});
};

// Autocomplete component props
export const autocomplete: ThemeComponentProps<AutocompleteProps> = {
	default: {
		themeStyleScript: autocompleteStyleScript,
		trendingTitle: 'Popular',
		termsTitle: 'Trending Terms',
		hideTerms: false,
		hideFacets: true,

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
				facetHierarchyOptions: {
					hideCount: true,
				},
				facetListOptions: {
					hideCheckbox: true,
					hideCount: true,
				},
				results: {
					columns: 3,
					rows: 1,
				},
				result: {
					hideBadge: true,
				},
			},
		},
	},
	mobile: {
		hideFacets: true,
		vertical: true,
		horizontalTerms: true,
		theme: {
			components: {
				results: {
					rows: 1,
					columns: 2,
				},
			},
		},
	},
	tablet: {
		hideFacets: true,
		vertical: true,
		horizontalTerms: true,
		theme: {
			components: {
				results: {
					rows: 1,
					columns: 3,
				},
			},
		},
	},
	desktop: {
		vertical: true,
		horizontalTerms: true,
		theme: {
			components: {
				results: {
					rows: 1,
					columns: 3,
				},
				facet: {
					limit: 4,
				},
			},
		},
	},
};
