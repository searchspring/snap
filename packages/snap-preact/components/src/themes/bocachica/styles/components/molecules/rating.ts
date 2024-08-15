import { css } from '@emotion/react';
import type { RatingProps } from '../../../../../components/Molecules/Rating';

// CSS in JS style script for the Rating component
const ratingStyleScript = ({ emptyRatingSrc, fullRatingSrc, theme }: RatingProps & { emptyRatingSrc?: string; fullRatingSrc?: string }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		textAlign: 'left',
		height: '24px',
		margin: '10px auto',

		'& .emptyRatingBox': {
			width: '129px',
			height: '24px',
			float: 'left',
			backgroundRepeat: 'no-repeat',
			background: `url(${emptyRatingSrc || '//4tcdn.blob.core.windows.net/4tjs1/images/allwallstarsempty.png'}) no-repeat`,
			textAlign: 'center',
			border: '0px !important',
		},

		'& .fullRatings': {
			background: `url(${fullRatingSrc || '//4tcdn.blob.core.windows.net/4tjs1/images/allwallstarsfull.png'}) no-repeat`,
			height: '24px',
			textAlign: 'left',
			backgroundRepeat: 'no-repeat',
			border: '0px !important',
			float: 'left',
		},
	});
};

// Rating component props
export const rating: Partial<RatingProps> = {
	styleScript: ratingStyleScript,
};
