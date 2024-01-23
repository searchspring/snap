/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Image, ImageProps } from '../../Atoms/Image';
import { Badge, BadgeProps } from '../../Atoms/Badge';
import { Price, PriceProps } from '../../Atoms/Price';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, cloneWithProps } from '../../../utilities';
import { filters } from '@searchspring/snap-toolbox';
import { ComponentProps, LayoutType, Layout, StylingCSS } from '../../../types';
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
					// flex: '1 0 auto',
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

			'& .selection-value': {
				padding: '5px',
				cursor: 'pointer',
			},
			'& .selection-value-selected': {
				fontWeight: 'bold',
			},
			'& .variant-selection': {
				display: 'grid',
				gridTemplateColumns: `repeat(${6}, 1fr)`,
			},
			'& .selection-value-disabled': {
				opacity: 0.5,
				textDecoration: 'line-through',
				// cursor: 'initial'
			},
			'& .variant-title': {
				fontWeight: 'bold',
				fontSize: '13px',
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

	const core = result?.display?.mappings.core || result?.mappings?.core;

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

	const onSale = Boolean(core?.msrp && core.price && core?.msrp * 1 > core?.price * 1);
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

	const selections = result.variants?.selections;

	return core ? (
		<CacheProvider>
			<article {...styling} className={classnames('ss__result', `ss__result--${layout}`, className)}>
				<div className="ss__result__image-wrapper">
					<a
						href={core.url}
						onClick={(e: React.MouseEvent<HTMLAnchorElement, Event>) => {
							onClick && onClick(e);
							controller?.track?.product?.click(e as any, result);
						}}
					>
						{!hideBadge && onSale && <Badge {...subProps.badge} />}
						{!hideImage && <Image {...subProps.image} />}
					</a>
				</div>
				<div className="ss__result__details">
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
					{selections && (
						<div className="ss__result__details__variants">
							{selections.map((selection: any) => {
								if (selection.values.length) {
									return (
										<div className="ss__result__details__variant">
											<div className="variant-title">{selection.label}: </div>
											<div className="variant-selection">
												{selection.values.map((value: any) => {
													return (
														<div
															className={`selection-value ${!value.available ? 'selection-value-disabled' : ''} ${
																selection.selected == value.value ? 'selection-value-selected' : ''
															}`}
															onClick={() => {
																selection.select(value.value);
															}}
														>
															{/* <div>label {value.label}</div> */}
															<div>{value.value}</div>
														</div>
													);
												})}
											</div>
										</div>
									);
								}
							})}
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
	badge: BadgeProps;
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
