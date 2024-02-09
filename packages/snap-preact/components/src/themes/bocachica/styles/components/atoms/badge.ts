import { css, BadgeProps } from '../../../../../index';

// CSS in JS style script for the Badge component
const badgeStyleScript = ({ position, theme }: BadgeProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'inline-block',
		position: 'absolute',
		...position,
	});
};

// Badge component props
export const badge: Partial<BadgeProps> = {
	styleScript: badgeStyleScript,
};
