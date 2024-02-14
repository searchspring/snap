import { css, RadioProps } from '../../../../../index';

// CSS in JS style script for the Radio component
const radioStyleScript = ({ size, native, theme }: RadioProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	if (native) {
		return css({
			width: size,
			height: size,
			display: 'flex',
			justifyContent: 'center',

			'.ss__radio__input': {
				height: `calc(${size} - 30%)`,
				width: `calc(${size} - 30%)`,
				margin: 'auto',
			},
		});
	}

	return css({
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: size,
		width: size,
		cursor: 'pointer',

		'&.ss__radio--disabled': {
			opacity: 0.5,
			cursor: 'none',
		},
	});
};

// Radio component props
export const radio: Partial<RadioProps> = {
	styleScript: radioStyleScript,
};
