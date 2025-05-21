import { css } from '@emotion/react';
import type { RadioProps } from '../../../../components/Molecules/Radio';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Radio component
const radioStyleScript = ({ size, native, color, theme }: RadioProps) => {
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
		'.ss__icon': {
			fill: color || variables?.colors.primary,
			stroke: color || variables?.colors.primary,
		},
	});
};

// Radio component props
export const radio: ThemeComponent<'radio', RadioProps> = {
	default: {
		radio: {
			themeStyleScript: radioStyleScript,
		},
	},
};
