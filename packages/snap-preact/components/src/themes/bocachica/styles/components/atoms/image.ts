import { css, ImageProps } from '../../../../../index';

// CSS in JS style script for the Image component
const imageStyleScript = ({ visibility, theme }: ImageProps & { visibility: React.CSSProperties['visibility'] }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

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
export const image: Partial<ImageProps> = {
	styleScript: imageStyleScript,
};
