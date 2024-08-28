import { css } from '@emotion/react';
import type { BadgeImageProps } from '../../../../../components/Atoms/BadgeImage';

// CSS in JS style script for the BadgeImage component
const badgeImageStyleScript = ({ theme }: BadgeImageProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		maxHeight: '100%',
		maxWidth: '100%',
	});
};

// BadgeImage component props
export const badgeImage: Partial<BadgeImageProps> = {
	styleScript: badgeImageStyleScript,
};
