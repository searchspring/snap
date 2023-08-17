import { css, IconProps } from '../../../../../index';
import { EverestVariables } from '../../../index';

// CSS in JS style script for the Icon component
const iconStyleScript = ({ color, height, width, size, theme }: IconProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as EverestVariables;

	return css({
		fill: color || theme?.colors?.primary,
		width: width || size,
		height: height || size,
		position: 'relative',
	});
};

// Icon component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-icon--custom
export const icon: IconProps = {
	styleScript: iconStyleScript,
};
