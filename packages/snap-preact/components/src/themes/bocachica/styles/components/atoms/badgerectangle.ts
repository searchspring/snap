import { css, BadgeRectangleProps } from '../../../../../index';

// CSS in JS style script for the BadgeRectangle component
const badgeRectangleStyleScript = ({ color, colorText, theme }: BadgeRectangleProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'inline-block',
		boxSizing: 'border-box',
		padding: '0.3em 0.9em',
		background: color,
		color: colorText,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		maxWidth: '100%',
	});
};

// BadgeRectangle component props
export const badgeRectangle: Partial<BadgeRectangleProps> = {
	styleScript: badgeRectangleStyleScript,
};
