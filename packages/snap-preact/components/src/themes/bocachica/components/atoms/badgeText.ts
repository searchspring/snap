import { css } from '@emotion/react';
import type { BadgeTextProps } from '../../../../components/Atoms/BadgeText';

// CSS in JS style script for the BadgeText component
const badgeTextStyleScript = ({ colorText, theme }: BadgeTextProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'inline-block',
		boxSizing: 'border-box',
		padding: '0.3em 0.9em',
		color: colorText,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		maxWidth: '100%',
	});
};

// BadgeText component props
export const badgeText: Partial<BadgeTextProps> = {
	styleScript: badgeTextStyleScript,
};
