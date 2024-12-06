import { Fragment, h } from 'preact';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Image, ImageProps } from '../../Atoms/Image';
import { Price, PriceProps } from '../../Atoms/Price';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, cloneWithProps, mergeProps, mergeStyles } from '../../../utilities';
import { filters } from '@searchspring/snap-toolbox';
import { ComponentProps, ResultsLayout, StyleScript } from '../../../types';
import { CalloutBadge, CalloutBadgeProps } from '../../Molecules/CalloutBadge';
import { OverlayBadge, OverlayBadgeProps } from '../../Molecules/OverlayBadge';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

const defaultStyles: StyleScript<ResultProps> = () => {
	return css({
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
	});
};

export const Result = observer((properties: ResultProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<ResultProps> = {
		layout: ResultsLayout.grid,
	};

	const props = mergeProps('result', globalTheme, defaultProps, properties);

	const {
		result,
		hideBadge,
		hideTitle,
		hidePricing,
		hideImage,
		detailSlot,
		fallback,
		disableStyles,
		className,
		layout,
		onClick,
		controller,
		treePath,
	} = props;

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
			treePath,
		},
		calloutBadge: {
			// default props
			className: 'ss__result__callout-badge',
			result,
			// global theme
			...globalTheme?.components?.calloutBadge,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		overlayBadge: {
			// default props
			className: 'ss__result__overlay-badge',
			result,
			controller: controller as SearchController | AutocompleteController | RecommendationController,
			// global theme
			...globalTheme?.components?.overlayBadge,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		image: {
			// default props
			className: 'ss__result__image',
			alt: core?.name || '',
			src: core?.imageUrl || '',
			// global theme
			...globalTheme?.components?.image,
			// inherited props
			...defined({
				disableStyles,
				fallback: fallback,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
	};

	let displayName = core?.name;
	if (props.truncateTitle) {
		displayName = filters.truncate(core?.name || '', props.truncateTitle.limit, props.truncateTitle.append);
	}

	const styling = mergeStyles<ResultProps>(props, defaultStyles);

	return core ? (
		<CacheProvider>
			<article {...styling} className={classnames('ss__result', `ss__result--${layout}`, className)}>
				<div className="ss__result__image-wrapper">
					<a
						href={core!.url}
						onClick={(e: React.MouseEvent<HTMLAnchorElement, Event>) => {
							onClick && onClick(e);
							controller?.track?.product?.click(e as any, result);
						}}
					>
						{!hideImage &&
							(!hideBadge ? (
								<OverlayBadge
									{...subProps.overlayBadge}
									controller={controller as SearchController | AutocompleteController | RecommendationController}
								>
									<Image {...subProps.image} />
								</OverlayBadge>
							) : (
								<Image {...subProps.image} />
							))}
					</a>
				</div>

				<div className="ss__result__details">
					{!hideBadge && (
						<CalloutBadge
							{...subProps.calloutBadge}
							controller={controller as SearchController | AutocompleteController | RecommendationController}
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
									<Price {...subProps.price} value={core.msrp} lineThrough={true} name={'msrp'} />
									&nbsp;
									<Price {...subProps.price} value={core.price} name={'price'} />
								</>
							) : (
								<Price {...subProps.price} value={core.price!} />
							)}
						</div>
					)}
					{cloneWithProps(detailSlot, { result, treePath })}
				</div>
			</article>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface ResultSubProps {
	calloutBadge: CalloutBadgeProps;
	overlayBadge: Omit<OverlayBadgeProps, 'children'>;
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
	detailSlot?: JSX.Element | JSX.Element[];
	fallback?: string;
	layout?: keyof typeof ResultsLayout | ResultsLayout;
	truncateTitle?: TruncateTitleProps;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, Event>) => void;
	controller?: SearchController | AutocompleteController | RecommendationController;
}
export type ResultNames = 'seed';
