import { css } from '@emotion/react';
import type { BannerProps } from '../../../../components/Atoms/Merchandising/Banner';

// CSS in JS style script for the Banner component
const bannerStyleScript = ({ theme }: BannerProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		' *': {
			boxSizing: 'border-box',
		},

		'& iframe, img': {
			maxWidth: '100%',
			height: 'auto',
		},
	});
};

// Banner component props
export const banner: Partial<BannerProps> = {
	themeStyleScript: bannerStyleScript,
};
