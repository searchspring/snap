import { css, ImageProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Image component
const imageStyleScript = ({ visibility, theme }: ImageProps & { visibility: React.CSSProperties['visibility'] }) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		height: 'auto',
		'& img': {
			visibility: visibility,
			flexShrink: '0',
			objectFit: 'contain',
			maxWidth: '100%',
			maxHeight: '100%',
		},
	});
};

// Image component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-image--broken-img
export const image: Omit<ImageProps, 'alt' | 'src'> = {
	styleScript: imageStyleScript,
};
