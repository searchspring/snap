/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Image, ImageProps } from '../../Atoms/Image';
import { Badge, BadgeProps } from '../../Atoms/Badge';
import { Price, PriceProps } from '../../Atoms/Price';
import { Theme, useTheme } from '../../../providers/theme';
import { defined } from '../../../utilities';
import { ComponentProps, LayoutType, Layout, Result as ResultType } from '../../../types';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';

const CSS = {
	result: ({ width, style }) =>
		css({
			display: 'inline-block',
			maxWidth: width ? 'initial' : '260px',
			width: width || 'auto',

			'&.ss__result--grid': {
				flexDirection: 'column',
			},
			'&.ss__result--list': {
				flexDirection: 'row',
				display: 'block',
				width: width || 'auto',
				maxWidth: 'initial',

				'& .ss__result__wrapper': {
					overflow: 'hidden',
					display: 'flex',
					'& .ss__result__wrapper__image': {
						float: 'left',
						maxWidth: '35%',
					},
					'& .ss__result__wrapper__details': {
						float: 'right',
						textAlign: 'left',
						verticalAlign: 'top',
						padding: '20px',
					},
				},
			},

			'& .ss__result__wrapper': {
				borderRadius: '5px',
				margin: '10px',
				position: 'relative',
				'& .ss__result__wrapper__image': {
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',

					'& img': {
						top: '0',
						left: '0',
						right: '0',
						width: 'auto',
						bottom: '0',
						margin: 'auto',
						height: 'auto',
						maxWidth: '100%',
					},

					'& .ss__result__badge': {
						background: 'rgba(255, 255, 255, 0.5)',
						padding: '10px',
					},
				},

				'& .ss__result__wrapper__details': {
					padding: '10px',
					'& .ss__result__wrapper__details__title': {
						marginBottom: '10px',
					},
					'& .ss__result__wrapper__details__pricing': {
						marginBottom: '10px',

						'& .ss__result__price': {
							fontSize: '1.2em',
						},
						'& .ss__price--strike': {
							fontSize: '80%',
						},
					},
					'& .ss__result__wrapper__details__button': {
						marginBottom: '10px',
					},
				},
			},
			...style,
		}),
};

export const Result = observer((properties: ResultProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: ResultProps = {
		// default props
		layout: Layout.GRID,
		// global theme
		...globalTheme?.components?.result,
		// props
		...properties,
		...properties.theme?.components?.result,
	};

	const { result, hideBadge, hideTitle, hidePricing, detailSlot, buttonSlot, fallback, disableStyles, className, width, layout, style, controller } =
		props;

	const core = result?.mappings?.core;

	const subProps: ResultSubProps = {
		price: {
			// global theme
			className: 'ss__result__price',
			...globalTheme?.components?.price,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			...props.theme?.components?.price,
		},
		badge: {
			// default props
			className: 'ss__result__badge',
			content: 'Sale',
			// global theme
			...globalTheme?.components?.badge,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			...props.theme?.components?.badge,
		},
		image: {
			// default props
			className: 'ss__result__image',
			alt: core?.name,
			src: core?.imageUrl,
			// global theme
			...globalTheme?.components?.image,
			// inherited props
			...defined({
				disableStyles,
				fallback: fallback,
			}),
			// component theme overrides
			...props.theme?.components?.image,
		},
	};

	const onSale = Boolean(core?.msrp && core?.msrp * 1 > core?.price * 1);

	return (
		core && (
			<article css={!disableStyles && CSS.result({ width, style })} className={classnames('ss__result', `ss__result--${layout}`, className)}>
				<div className="ss__result__wrapper">
					<div className="ss__result__wrapper__image">
						<a
							href={core.url}
							onMouseDown={(e) => {
								controller?.track?.product?.click(e, result);
							}}
						>
							{!hideBadge && onSale && <Badge {...subProps.badge} />}
							<Image {...subProps.image} />
						</a>
					</div>
					<div className="ss__result__wrapper__details">
						{!detailSlot ? (
							<>
								{!hideTitle && (
									<div className="ss__result__wrapper__details__title">
										<a
											href={core.url}
											onMouseDown={(e) => {
												controller?.track?.product?.click(e, result);
											}}
										>
											{core.name}
										</a>
									</div>
								)}
								{!hidePricing && (
									<div className="ss__result__wrapper__details__pricing">
										{core.price < core.msrp ? (
											<>
												<Price {...subProps.price} value={core.price} />
												&nbsp;
												<Price {...subProps.price} value={core.msrp} lineThrough={true} />
											</>
										) : (
											<Price {...subProps.price} value={core.price} />
										)}
									</div>
								)}
							</>
						) : (
							<>{detailSlot}</>
						)}

						{buttonSlot && <div className="ss__result__wrapper__details__button">{buttonSlot}</div>}
					</div>
				</div>
			</article>
		)
	);
});

interface ResultSubProps {
	badge: BadgeProps;
	price: PriceProps;
	image: ImageProps;
}

export interface ResultProps extends ComponentProps {
	result: ResultType;
	hideBadge?: boolean;
	hideTitle?: boolean;
	hidePricing?: boolean;
	detailSlot?: string | JSX.Element;
	buttonSlot?: string | JSX.Element;
	fallback?: string;
	width?: string;
	layout?: LayoutType;
	controller?: SearchController | AutocompleteController | RecommendationController;
}
