import { css, BadgeProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Badge component

const badgeStyleScript = ({ position, theme }: BadgeProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'inline-block',
		position: 'absolute',
		...position,
	});
};

// Badge component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-badge--badge-with-children
export const badge: BadgeProps = {
	styleScript: badgeStyleScript,
};
