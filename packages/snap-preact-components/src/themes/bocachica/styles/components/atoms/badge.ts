import { css, BadgeProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Badge component
const badgeStyleScript = ({ position, theme }: BadgeProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

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
