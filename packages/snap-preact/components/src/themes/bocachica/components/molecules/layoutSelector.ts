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
			color: `rgba(109,113,117,.2)`,
			'.ss__icon': {
				fill: `rgba(109,113,117,.2)`,
				stroke: `rgba(109,113,117,.2)`,
			},
			'&.ss__list__option--selected': {
				color: variables?.colors.accent,
				'.ss__icon': {
					fill: variables?.colors.accent,
					stroke: variables?.colors.accent,
				},
			},
		},
	});
};

// LayoutSelector component props
export const layoutSelector: ThemeComponentProps<LayoutSelectorProps> = {
	default: {
		themeStyleScript: layoutSelectorStyleScript,
		type: 'list',
		hideLabel: true,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
