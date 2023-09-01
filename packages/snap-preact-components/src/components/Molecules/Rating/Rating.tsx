/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { mergeProps } from '../../../utilities';

const CSS = {
	rating: ({ emptyRatingSrc, fullRatingSrc }: { emptyRatingSrc?: string; fullRatingSrc?: string }) =>
		css({
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
		}),
};

export const Rating = observer((properties: RatingProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<RatingProps> = {};

	const props = mergeProps('rating', globalTheme, defaultProps, properties);

	const { emptyRatingSrc, fullRatingSrc, showEmptyRatings, count, disableStyles, className, style, styleScript } = props;

	let rating = props.rating;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, emptyRatingSrc, fullRatingSrc };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.rating(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	if (isNaN(rating)) {
		rating = 0;
	}
	if (rating > 5) {
		rating = 5;
	}

	const star = Math.floor(rating * 20);

	return showEmptyRatings || rating ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__rating', className)}>
				<div className={classnames('emptyRatingBox')}>
					<div style={{ width: `${star}%` }} className={classnames('fullRatings')}></div>
				</div>
				{count && <span className={classnames('ratingCount')}>({count})</span>}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface RatingProps extends ComponentProps {
	rating: number;
	count?: number;
	showEmptyRatings?: boolean;
	//todo
	// emptyRatingSrc?: string | JSX.Element;
	// fullRatingSrc?: string | JSX.Element;
	emptyRatingSrc?: string;
	fullRatingSrc?: string;
}
