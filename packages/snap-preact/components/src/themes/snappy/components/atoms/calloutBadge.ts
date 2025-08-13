import { css } from '@emotion/react';
import { ThemeComponent } from '../../../../providers';
import { CalloutBadgeProps } from '../../../../components/Molecules/CalloutBadge';

// CSS in JS style script for the Button component
const calloutBadgeStyleScript = ({}: CalloutBadgeProps) => {
	return css({
		'& .ss__badge-text': {
			paddingLeft: '0px',
		},
	});
};

// Button component props
export const calloutBadge: ThemeComponent<'calloutBadge', CalloutBadgeProps> = {
	default: {
		calloutBadge: {
			themeStyleScript: calloutBadgeStyleScript,
		},
	},
};
