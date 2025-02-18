import { css } from '@emotion/react';
import type { FacetsHorizontalProps } from '../../../../components/Organisms/FacetsHorizontal';

// CSS in JS style script for the Facets component
const facetsHorizontalStyleScript = ({ theme }: FacetsHorizontalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		paddingBottom: '10px',

		'& .ss__facets-horizontal__header': {
			'& .ss__facets-horizontal__header__dropdown': {
				margin: '0',

				'& .ss__icon': {
					transition: 'transform ease .5s',
				},

				'& .ss__dropdown__button__heading': {
					color: variables?.colors?.secondary,
					fontWeight: 'bold',
				},

				'&.ss__dropdown--open': {
					'& .ss__dropdown__button__heading': {
						'& .ss__icon': {
							transform: 'rotate(180deg)',
						},
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
	});
};

// FacetsHorizontal component props
export const facetsHorizontal: ThemeComponentProps<FacetsHorizontalProps> = {
	default: {
		themeStyleScript: facetsHorizontalStyleScript,
		iconCollapse: 'angle-down',
	},
	mobile: {
		limit: 0,
	},
	tablet: {
		limit: 5,
	},
	desktop: {
		limit: 7,
	},
};
