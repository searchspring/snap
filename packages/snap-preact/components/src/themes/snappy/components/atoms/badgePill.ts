import { css } from '@emotion/react';
import type { BadgePillProps } from '../../../../components/Atoms/BadgePill';

// CSS in JS style script for the BadgePill component

const badgePillStyleScript = ({ theme }: BadgePillProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		margin: '10px',
	});
};

// BadgePill component props
export const badgePill: ThemeComponentProps<BadgePillProps> = {
	default: {
		themeStyleScript: badgePillStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
