// import { css } from '@emotion/react';
import type { RatingProps } from '../../../../components/Molecules/Rating';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the Rating component
// const ratingStyleScript = () => {
// };

// Rating component props
export const rating: ThemeComponent<'rating', RatingProps> = {
	default: {
		props: {
			// themeStyleScript: ratingStyleScript,
		},
	},
};
