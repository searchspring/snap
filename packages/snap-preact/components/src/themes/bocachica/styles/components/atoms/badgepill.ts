import { css, BadgePillProps } from '../../../../../index';

// CSS in JS style script for the BadgePill component
const badgePillStyleScript = ({ color, colorText, theme }: BadgePillProps) => {
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
		borderRadius: '1em',
	});
};

// BadgePill component props
export const badgePill: Partial<BadgePillProps> = {
	styleScript: badgePillStyleScript,
};
