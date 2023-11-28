import { css, IconProps } from '../../../../../index';

// CSS in JS style script for the Icon component
const iconStyleScript = ({ color, height, width, size, theme }: IconProps) => {
	const variables = theme?.variables;

	return css({
		fill: color || variables?.color?.accent,
		width: width || size,
		height: height || size,
		position: 'relative',
	});
};

// Icon component props
export const icon: Partial<IconProps> = {
	styleScript: iconStyleScript,
};
