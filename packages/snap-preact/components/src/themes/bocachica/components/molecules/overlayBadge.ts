import { css } from '@emotion/react';
import type { OverlayBadgeProps } from '../../../../components/Molecules/OverlayBadge';

// CSS in JS style script for the Search component
const overlayBadgeStyleScript = ({ theme }: OverlayBadgeProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__overlay-badge__grid-wrapper': {
			padding: '0.5rem',
		},
	});
};

// OverlayBadge component props
export const overlayBadge: ThemeComponentProps<OverlayBadgeProps> = {
	default: {
		themeStyleScript: overlayBadgeStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
