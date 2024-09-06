import { css } from '@emotion/react';
import type { InlineBannerProps } from '../../../../components/Atoms/Merchandising/InlineBanner';

// CSS in JS style script for the InlineBanner component
const inlineBannerStyleScript = ({ width, theme }: InlineBannerProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		'&.ss__inline-banner--grid': {
			flexDirection: 'column',
		},
		'&.ss__inline-banner--list': {
			flexDirection: 'row',
			display: 'block',
			width: '100%',
		},
		'& iframe': {
			maxWidth: '100%',
		},
	});
};

// InlineBanner component props
export const inlineBanner: Partial<InlineBannerProps> = {
	styleScript: inlineBannerStyleScript,
};
