import type { CalloutBadgeProps } from '../../../../components/Molecules/CalloutBadge';
import { css } from '@emotion/react';

// CSS in JS style script for the BadgePill component

const calloutBadgeStyleScript = ({ theme }: CalloutBadgeProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		paddingLeft: '0px',

		'& .ss__badge-text': {
			paddingLeft: '0px',
		},
	});
};

// CalloutBadge component props
export const calloutBadge: ThemeComponentProps<CalloutBadgeProps> = {
	default: {
		themeStyleScript: calloutBadgeStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
