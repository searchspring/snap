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
import { ComponentProps, Result as ResultType } from '../../../types';

const CSS = {
	result: ({ style }) =>
		css({
			position: 'relative',
			display: 'inline-block',
			border: '1px solid #ccc',
			borderRadius: '5px',
			margin: '10px',
			maxWidth: '260px',

			'& .ss-result__image-wrapper': {
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
			// global theme
			...globalTheme?.components?.result,
			// props
			...properties,
			...properties.theme?.components?.result,
		};

		const { result, hideBadge, hideTitle, hidePricing, detailsSlot, buttonSlot, fallback, disableStyles, className, style } = props;

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
				<article css={!disableStyles && CSS.result({ style })} className={classnames('ss-result', className)}>
					<div className={'ss-result__image-wrapper'}>
						<a href={core.url}>
							{!hideBadge && onSale && <Badge {...subProps.badge} />}
							<Image {...subProps.image} style={{ width: '100%' }} />
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
												<Price value={core.msrp} disableStyles={disableStyles} />
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
}
