/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Image, ImageProps } from '../../Atoms/Image';
import { Price, PriceProps } from '../../Atoms/Price';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, cloneWithProps } from '../../../utilities';
import { filters } from '@searchspring/snap-toolbox';
import { ComponentProps, LayoutType, Layout, StylingCSS } from '../../../types';
import { CalloutBadge, CalloutBadgeProps } from '../../Molecules/CalloutBadge';
import { OverlayBadge, OverlayBadgeProps } from '../../Molecules/OverlayBadge';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

const CSS = {
	result: () =>
		css({
			'&.ss__result--grid': {
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				'& .ss__result__image-wrapper': {
					flex: '1 0 auto',
					minHeight: '0%',
				},
			},
			'&.ss__result--list': {
				display: 'flex',
				flexDirection: 'row',
				'& .ss__result__image-wrapper': {
					flex: '0 0 33%',
				},
				'& .ss__result__details': {
					flex: '1 1 auto',
					textAlign: 'left',
					marginLeft: '20px',
					padding: 0,
				},
			},

			'& .ss__result__image-wrapper': {
				position: 'relative',
				'& .ss__result__badge': {
					background: 'rgba(255, 255, 255, 0.5)',
					padding: '10px',
				},
			},

			'& .ss__result__details': {
				padding: '10px',
				textAlign: 'center',

				'& .ss__result__details__title': {
					marginBottom: '10px',
				},
				'& .ss__result__details__pricing': {
					marginBottom: '10px',

					'& .ss__result__price': {
						fontSize: '1.2em',
					},
					'& .ss__price--strike': {
						fontSize: '80%',
					},
				},
				'& .ss__result__details__button': {
					marginBottom: '10px',
				},
			},
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

	const { result, hideBadge, hideTitle, hidePricing, hideImage, detailSlot, fallback, disableStyles, className, layout, onClick, style, controller } =
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
			theme: props.theme,
		},
		calloutBadge: {
			// default props
			className: 'ss__result__callout-badge',
			// global theme
			...globalTheme?.components?.calloutBadge,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
		overlayBadge: {
			// default props
			className: 'ss__result__overlay-badge',
			// global theme
			...globalTheme?.components?.overlayBadge,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
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
			theme: props?.theme,
		},
	};

	let displayName = core?.name;
	if (props.truncateTitle) {
		displayName = filters.truncate(core?.name || '', props.truncateTitle.limit, props.truncateTitle.append);
	}

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.result(), style];
	} else if (style) {
		styling.css = [style];
	}

	const ImageWrapper = () => {
		return (
			<div className="ss__result__image-wrapper">
				<a
					href={core!.url}
					onClick={(e: React.MouseEvent<HTMLAnchorElement, Event>) => {
						onClick && onClick(e);
						controller?.track?.product?.click(e as any, result);
					}}
				>
					{!hideImage && <Image {...subProps.image} />}
				</a>
			</div>
		);
	};

	return core ? (
		<CacheProvider>
			<article {...styling} className={classnames('ss__result', `ss__result--${layout}`, className)}>
				{!hideBadge ? (
					<OverlayBadge
						{...subProps.overlayBadge}
						result={result}
						controller={controller as SearchController | AutocompleteController | RecommendationController}
					>
						<ImageWrapper />
					</OverlayBadge>
				) : (
					<ImageWrapper />
				)}

				<div className="ss__result__details">
					{!hideBadge && (
						<CalloutBadge
							{...subProps.calloutBadge}
							result={result}
							controller={controller as SearchController | AutocompleteController | RecommendationController}
							name={'callout'}
						/>
					)}
					{!hideTitle && (
						<div className="ss__result__details__title">
							<a
								href={core.url}
								onClick={(e: React.MouseEvent<HTMLAnchorElement, Event>) => {
									onClick && onClick(e);
									controller?.track?.product?.click(e as any, result);
								}}
								dangerouslySetInnerHTML={{
									__html: displayName || '',
								}}
							/>
						</div>
					)}
					{!hidePricing && (
						<div className="ss__result__details__pricing">
							{core.msrp && core.price && core.price < core.msrp ? (
								<>
									<Price {...subProps.price} value={core.msrp} lineThrough={true} />
									&nbsp;
									<Price {...subProps.price} value={core.price} />
								</>
							) : (
								<Price {...subProps.price} value={core.price!} />
							)}
						</div>
					)}
					{cloneWithProps(detailSlot, { result })}
				</div>
			</article>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface ResultSubProps {
	calloutBadge: CalloutBadgeProps;
	overlayBadge: OverlayBadgeProps;
	price: PriceProps;
	image: ImageProps;
}
interface TruncateTitleProps {
	limit: number;
	append?: string;
}

export interface ResultProps extends ComponentProps {
	result: Product;
	hideBadge?: boolean;
	hideTitle?: boolean;
	hideImage?: boolean;
	hidePricing?: boolean;
	detailSlot?: JSX.Element;
	fallback?: string;
	layout?: LayoutType;
	truncateTitle?: TruncateTitleProps;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, Event>) => void;
	controller?: SearchController | AutocompleteController | RecommendationController;
}
