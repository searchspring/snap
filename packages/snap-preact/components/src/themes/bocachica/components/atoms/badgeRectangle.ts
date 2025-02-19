// import { css } from '@emotion/react';
import type { BadgeRectangleProps } from '../../../../components/Atoms/BadgeRectangle';

// CSS in JS style script for the BadgeRectangle component
/*
const badgeRectangleStyleScript = ({ color, colorText, theme }: BadgeRectangleProps) => {
	return css({
	});
};
*/

// BadgeRectangle component props
export const badgeRectangle: ThemeComponentProps<BadgeRectangleProps> = {
	default: {
		// themeStyleScript: badgeImageStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
