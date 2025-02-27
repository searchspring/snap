import { css } from '@emotion/react';
import type { BadgeTextProps } from '../../../../components/Atoms/BadgeText';

// CSS in JS style script for the BadgeText component
const badgeTextStyleScript = ({}: BadgeTextProps) => {
	return css({
		// color: "white"
	});
};

// BadgeText component props
export const badgeText: ThemeComponentProps<BadgeTextProps> = {
	default: {
		themeStyleScript: badgeTextStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
