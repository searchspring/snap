import { css } from '@emotion/react';

export const Styling = (properties) => {
	// const { theme } = properties;

	return css({
		// background: "gray",

		'.ss-title': {
			fontFamily: properties.theme.primaryFont || 'Roboto, Helvetica, Arial',
		},
	});
};
