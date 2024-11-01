import { css } from '@emotion/react';
import type { BadgeImageProps } from '../../../../components/Atoms/BadgeImage';

// CSS in JS style script for the BadgeImage component
const badgeImageStyleScript = () => {
	return css({
		maxHeight: '100%',
		maxWidth: '100%',
	});
};

// BadgeImage component props
export const badgeImage: Partial<BadgeImageProps> = {
	themeStyleScript: badgeImageStyleScript,
};
