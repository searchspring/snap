import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';

const CSS = {
	rating: ({}: Partial<RatingProps>) =>
		css({
			display: 'flex',
			alignItems: 'center',

			'& .ss__rating__icons': {
				position: 'relative',
			},

			'& .ss__rating__stars': {
				width: '100%',
				display: 'inline-grid',
				gridTemplateColumns: '20% 20% 20% 20% 20%',

				'&.ss__rating__stars--full': {
					position: 'absolute',
					top: 0,
					left: 0,
				},

				'&.ss__rating__stars--empty': {
					position: 'relative',
				},
			},

			'& .ss__rating__stars__star': {
				overflow: 'hidden',
			},
		}),
};

export const Rating = observer((properties: RatingProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<RatingProps> = {
		fullIcon: 'star',
		emptyIcon: 'star-o',
	};

	const props = mergeProps('rating', globalTheme, defaultProps, properties);

	const { alwaysRender, count, text, disablePartialFill, emptyIcon, fullIcon, disableStyles, className, style, styleScript } = props;

	const subProps: RatingSubProps = {
		fullIcon: {
			// default props
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		emptyIcon: {
			// default props
			color: '#ccc',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	// normalize values to ensure good rendering
	let value = props.value;
	if (isNaN(value)) {
		value = Number(value) || 0;
	}
	if (value < 0) {
		value = 0;
	}
	if (value > 5) {
		value = 5;
	}

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, value };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.rating(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	// with 'disablePartialFill' we are rounding down
	const numStarsToShow = disablePartialFill ? Math.floor(value) : Math.ceil(value);

	return alwaysRender || value || count ? (
		<CacheProvider>
			<div className={classnames('ss__rating', className)} {...styling}>
				<div className="ss__rating__icons">
					<div className="ss__rating__stars ss__rating__stars--empty">
						{[...Array(5)].map(() => (
							<span className="ss__rating__stars__star ss__rating__stars__star--empty">
								<Icon
									name={'ss__rating__stars__star--empty'}
									{...subProps.emptyIcon}
									{...(typeof emptyIcon == 'string' ? { icon: emptyIcon } : (emptyIcon as Partial<IconProps>))}
								/>
							</span>
						))}
					</div>
					<div className="ss__rating__stars ss__rating__stars--full">
						{[...Array(numStarsToShow)].map((e, i) => {
							let width = 100;
							//if its the last star and there is remainder
							if (i + 1 == numStarsToShow && !disablePartialFill && value % 1 != 0) {
								width = (value % 1 || 1) * 100;
							}

							return (
								<span className="ss__rating__stars__star ss__rating__stars__star--full" style={{ width: `${width}%` }}>
									<Icon
										name={'ss__rating__stars__star--full'}
										{...subProps.fullIcon}
										{...(typeof fullIcon == 'string' ? { icon: fullIcon } : (fullIcon as Partial<IconProps>))}
									/>
								</span>
							);
						})}
					</div>
				</div>

				{count ? <span className="ss__rating__count">({count})</span> : <></>}
				{text ? <span className="ss__rating__text">{text}</span> : <></>}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface RatingSubProps {
	fullIcon: Partial<IconProps>;
	emptyIcon: Partial<IconProps>;
}

export interface RatingProps extends ComponentProps {
	value: number;
	count?: number;
	text?: string;
	alwaysRender?: boolean;
	disablePartialFill?: boolean;
	fullIcon?: IconType | Partial<IconProps>;
	emptyIcon?: IconType | Partial<IconProps>;
}
