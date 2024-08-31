import { css } from '@emotion/react';
import type { HorizontalFacetsProps } from '../../../../../components/Organisms/HorizontalFacets';

// CSS in JS style script for the Facets component
const horizontalFacetsStyleScript = ({ theme }: HorizontalFacetsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__horizontal-facets__header': {
			display: 'flex',
			flexWrap: 'wrap',

			'& .ss__mobile-sidebar': {
				margin: '0 10px',
			},

			'& .ss__horizontal-facets__header__dropdown': {
				flex: '0 0 0%',
				margin: '0 0 10px 0',
				boxSizing: 'border-box',
				minWidth: '100px',

				'& .ss__icon': {
					transition: 'transform ease .5s',
				},

				'& .ss__dropdown__button__heading': {
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '5px 10px',
				},

				'&.ss__dropdown--open': {
					'& .ss__dropdown__button__heading': {
						backgroundColor: variables?.colors?.active?.background,
						color: variables?.colors?.active?.foreground,

						'& .ss__icon': {
							fill: variables?.colors?.active?.accent,
							transform: 'rotate(180deg)',
						},
					},
					'& .ss__dropdown__content': {
						padding: '10px',
						minWidth: '160px',
						width: 'max-content',
						maxHeight: '500px',
						overflowY: 'auto',
						zIndex: 1,
					},
				},
			},
		},
		'&.ss__horizontal-facets--overlay': {
			'& .ss__horizontal-facets__header__dropdown': {
				'&.ss__dropdown--open': {
					'& .ss__dropdown__content': {
						border: `1px solid ${variables?.colors?.active?.background || '#ccc'}`,
					},
				},
			},
		},
		'& .ss__facet__show-more-less': {
			display: 'block',
			margin: '8px 8px 0 8px',
			cursor: 'pointer',
			'& .ss__icon': {
				marginRight: '8px',
			},
		},
	});
};

// Facets component props
export const horizontalFacets: Partial<HorizontalFacetsProps> = {
	styleScript: horizontalFacetsStyleScript,
	iconCollapse: 'angle-down',
};
