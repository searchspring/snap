import { css } from '@emotion/react';
import type { LayoutSelectorProps } from '../../../../components/Molecules/LayoutSelector';

// CSS in JS style script for the LayoutSelector component
const layoutSelectorStyleScript = ({ theme }: LayoutSelectorProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__button__content': {
			gap: '7px',
		},

		'.ss__list__option': {
			color: '#e6e6e6',
			border: '2px solid #e6e6e6',
			padding: '10px',
			borderRadius: '50%',
			'.ss__icon': {
				fill: `#e6e6e6`,
				stroke: `#e6e6e6`,
			},
			'&:hover': {
				color: 'black',
				border: '2px solid black',
				opacity: 0.7,
				'.ss__icon': {
					fill: 'black',
					stroke: 'black',
				},
			},
		},

		'.ss__list__option--selected': {
			color: 'black',
			border: '2px solid black',
			'.ss__icon': {
				fill: 'black',
				stroke: 'black',
			},
		},
	});
};

// LayoutSelector component props
export const layoutSelector: ThemeComponent<'layoutSelector', LayoutSelectorProps> = {
	default: {
		props: {
			themeStyleScript: layoutSelectorStyleScript,
			type: 'list',
			hideLabel: true,
		},
		components: {
			'*layoutSelector icon': {
				size: '5px',
			},
		},
	},
};
