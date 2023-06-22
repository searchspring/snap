import { css } from '@emotion/react';

export const Styling = (properties) => {
	// const { theme } = properties;

	return css({
		fontFamily: properties.theme.primaryFont,

		'.ss-title': {
			fontFamily: properties.theme.secondaryFont || 'Roboto, Helvetica, Arial',
		},
	});
};
