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
import { ComponentProps, LayoutType, Result as ResultType } from '../../../types';

const CSS = {
	list: () =>
		css({
			flexDirection: 'row',
			display: 'block',
			width: '100%',

			'& .ss-result__wrapper': {
				overflow: 'hidden',
				display: 'flex',
			},
			'& .ss-result__image-wrapper': {
				float: 'left',
				maxWidth: '35%',
			},
			'& .ss-result__details-wrapper': {
				float: 'right',
				textAlign: 'left',
				verticalAlign: 'top',
				padding: '20px',
			},
		}),
	grid: () =>
		css({
			flexDirection: 'column',
		}),

	result: ({ width, style }) =>
		css({
			display: 'inline-block',
			maxWidth: width ? 'initial' : '260px',
			width: width || 'auto',

			'& .ss-result__wrapper': {
				border: '1px solid #ccc',
				borderRadius: '5px',
				margin: '10px',
				position: 'relative',
			},

			'& .ss-result__image-wrapper': {
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

				'& .ss-badge': {
					background: 'rgba(255, 255, 255, 0.5)',
					padding: '10px',
				},
			},

			'& .ss-result__details-wrapper': {
				padding: '10px',

				'& .ss-result__details-wrapper-name': {
					fontSize: '120%',
					marginBottom: '10px',
				},

				'& .ss-result__details-wrapper-price': {
					marginBottom: '10px',

					'& .ss-result__details-wrapper-price-large': {
						fontSize: '140%',
					},

					'& .ss-result__details-wrapper-price-linethrough': {
						textDecoration: 'line-through',
					},
				},

				'& .ss-result__details-wrapper-button': {
					marginBottom: '10px',

					'& button': {
						display: 'block',
						margin: '0 auto',
					},
				},
			},
			...style,
		}),
};

export const Result = observer(
	(properties: ResultProps): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: ResultProps = {
			// default props
			hideBadge: false,
			hideTitle: false,
			hidePricing: false,
			disableStyles: false,
			layout: 'grid',
			// global theme
			...globalTheme?.components?.result,
			// props
			...properties,
			...properties.theme?.components?.result,
		};

		const { result, hideBadge, hideTitle, hidePricing, detailsSlot, buttonSlot, fallback, disableStyles, className, width, layout, style } = props;

		const core = result?.mappings?.core;

		const subProps: ResultSubProps = {
			price: {
				// global theme
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
				alt: core?.name,
				src: core?.thumbnailImageUrl,
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
				<article
					css={
						!disableStyles &&
						css`
							${CSS.result({ width, style })} ${CSS[layout]()}
						`
					}
					className={classnames('ss-result', className)}
				>
					<div className={'ss-result__wrapper'}>
						<div className={'ss-result__image-wrapper'}>
							<a href={core.url}>
								{!hideBadge && onSale && <Badge {...subProps.badge} />}
								<Image {...subProps.image} />
							</a>
						</div>
						<div className={'ss-result__details-wrapper'}>
							{!detailsSlot ? (
								<>
									{!hideTitle && (
										<div className={'ss-result__details-wrapper-name'}>
											<a href={core.url}>{core.name}</a>
										</div>
									)}
									{!hidePricing && (
										<div className={'ss-result__details-wrapper-price'}>
											{core.price < core.msrp ? (
												<>
													<span className={'ss-result__details-wrapper-price-large'}>
														<Price {...subProps.price} value={core.price} />
													</span>
													&nbsp;
													<span className={'ss-result__details-wrapper-price-linethrough'}>
														<Price {...subProps.price} value={core.msrp} />
													</span>
												</>
											) : (
												<span className={'ss-result__details-wrapper-price-large'}>
													<Price {...subProps.price} value={core.price} />
												</span>
											)}
										</div>
									)}
								</>
							) : (
								<>{detailsSlot}</>
							)}

							{buttonSlot && <div className={'ss-result__button-wrapper'}>{buttonSlot}</div>}
						</div>
					</div>
				</article>
			)
		);
	}
);

interface ResultSubProps {
	badge?: BadgeProps;
	price?: PriceProps;
	image?: ImageProps;
}

export interface ResultProps extends ComponentProps {
	result: ResultType;
	hideBadge?: boolean;
	hideTitle?: boolean;
	hidePricing?: boolean;
	detailsSlot?: string | JSX.Element;
	buttonSlot?: string | JSX.Element;
	fallback?: string;
	width?: string;
	layout?: LayoutType;
}
