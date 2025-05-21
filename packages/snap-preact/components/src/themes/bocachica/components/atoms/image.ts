import { css } from '@emotion/react';
import type { ImageProps } from '../../../../components/Atoms/Image';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Image component
const imageStyleScript = ({ visibility, theme }: ImageProps & { visibility: React.CSSProperties['visibility'] }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& img': {
			visibility: visibility,
		},
	});
};

// Image component props
export const image: ThemeComponent<'image', ImageProps> = {
	default: {
		image: {
			themeStyleScript: imageStyleScript,
		},
	},
};
