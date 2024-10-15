import { css } from '@emotion/react';
import type { FacetsHorizontalProps } from '../../../../components/Organisms/FacetsHorizontal';

// CSS in JS style script for the Facets component
const facetsHorizontalStyleScript = ({ theme }: FacetsHorizontalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__facets-horizontal__header': {
			display: 'flex',
			flexWrap: 'wrap',
			gap: '10px',

			'& .ss__facets-horizontal__header__dropdown': {
				flex: '0 0 0%',
				margin: '0',
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
					color: variables?.colors?.secondary,
					fontWeight: 'bold',
				},

				'&.ss__dropdown--open': {
					'& .ss__dropdown__button__heading': {
						'& .ss__icon': {
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
		'&.ss__facets-horizontal--overlay': {
			'& .ss__facets-horizontal__header__dropdown': {
				'&.ss__dropdown--open': {
					'& .ss__dropdown__button': {
						boxShadow: '0 6px 12px 1px #0000001f',
					},
					'& .ss__dropdown__content': {
						boxShadow: '0 6px 12px 1px #0000001f',
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
export const facetsHorizontal: Partial<FacetsHorizontalProps> = {
	styleScript: facetsHorizontalStyleScript,
	iconCollapse: 'angle-down',
};
