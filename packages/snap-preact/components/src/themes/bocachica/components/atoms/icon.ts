import { css } from '@emotion/react';
import type { IconProps } from '../../../../components/Atoms/Icon';

// CSS in JS style script for the Icon component
const iconStyleScript = ({ color, height, width, size, theme }: IconProps) => {
	const variables = theme?.variables;

	return css({
		fill: color || variables?.colors?.accent,
		stroke: color || variables?.colors?.accent,
		width: width || size,
		height: height || size,
		position: 'relative',
	});
};

// Icon component props
export const icon: Partial<IconProps> = {
	styleScript: iconStyleScript,
};
