/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	rating: () =>
		css({
			display: 'flex',

			'& .ss__rating__stars': {
				position: 'relative',
			},

			'& .ss__rating__stars__individualStar': {
				flexBasis: '20%',
				overflow: 'hidden',
			},

			'& .ss__rating__stars__empty': {
				position: 'relative',
				zIndex: 5,
				display: 'flex',
				flexDirection: 'row',
				textAlign: 'center',
				border: '0px !important',
			},

			'& .ss__rating__stars__full': {
				position: 'absolute',
				top: 0,
				left: 0,
				zIndex: 10,
				display: 'flex',
				flexDirection: 'row',
				border: '0px !important',
			},
		}),
};

export const Rating = observer((properties: RatingProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<RatingProps> = {};

	const props = mergeProps('rating', globalTheme, defaultProps, properties);

	const { showEmptyRatings, count, additionalText, disablePartialFill, disableStyles, className, style } = props;

	const subProps: RatingSubProps = {
		EmptyStar: {
			// default props
			//todo make this a star
			icon: 'star',
			color: 'black',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		FullStar: {
			// default props
			//todo make this a star
			icon: 'star',
			color: 'gray',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	let value = props.value;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.rating(), style];
	} else if (style) {
		styling.css = [style];
	}

	if (isNaN(value)) {
		value = 0;
	}
	if (value > 5) {
		value = 5;
	}

	const numStarsToShow = disablePartialFill ? Math.floor(value) : Math.ceil(value);

	return showEmptyRatings || value ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__rating', className)}>
				<div className="ss__rating__stars">
					<div className="ss__rating__stars__empty">
						{[...Array(5)].map(() => (
							<div className="ss__rating__stars__individualStar ss__rating__stars__empty__individualStar--empty">
								<Icon name={'emptyStar'} {...subProps.EmptyStar} />
							</div>
						))}
					</div>
					<div className="ss__rating__stars__full">
						{[...Array(numStarsToShow)].map((e, i) => {
							let width = 100;
							//if its the last star and there is remainder
							if (i + 1 == numStarsToShow && !disablePartialFill && value % 1 != 0) {
								width = (value % Math.floor(value)) * 100;
							}

							return (
								<div className="ss__rating__stars__individualStarWrapper">
									<div className="ss__rating__stars__individualStar ss__rating__stars__full__individualStar--full" style={{ width: `${width}%` }}>
										<Icon name={'fullStar'} {...subProps.FullStar} />
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{count ? <span className="ss__rating__ratingCount">({count})</span> : <></>}
				{additionalText ? <span className="ss__rating__additionalText">{additionalText}</span> : <></>}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface RatingSubProps {
	EmptyStar: Partial<IconProps>;
	FullStar: Partial<IconProps>;
}

export interface RatingProps extends ComponentProps {
	value: number;
	count?: number;
	additionalText?: string;
	showEmptyRatings?: boolean;
	disablePartialFill?: boolean;
}
