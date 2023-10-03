/** @jsx jsx */
import { h, Fragment } from 'preact';
import { MutableRef, useRef } from 'preact/hooks';
import { jsx, css, keyframes } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { useIntersection } from '../../../hooks';
import type { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import { Button, ButtonProps } from '../Button';

const CSS = {
	LoadMore: ({
		pagination,
		hideProgressIndicator,
		hideProgressText,
		progressIndicatorWidth,
		progressIndicatorSize,
		color,
		backgroundColor,
		theme,
	}: Partial<LoadMoreProps>) => {
		const radialAngle = ((360 / 100) * Math.floor((pagination!.end / pagination!.totalResults) * 100)) / 2;

		return css({
			'& .ss__loadMore__button': {
				'& .ss__icon--spinner': {
					marginLeft: '5px',
					animation: `${keyframes({
						'0%': { transform: `rotate(0deg)` },
						'100%': { transform: `rotate(360deg)` },
					})} linear 1s infinite`,
				},
			},
			'&.ss__loadMore--bar': {
				display: 'flex',
				flexDirection: 'column',
				width: 'fit-content',
				gap: '20px',

				'& .ss__loadMore__button': {
					margin: '0 auto',
				},
				'& .ss__loadMore__progress': {
					display: 'flex',
					flexDirection: 'column',
					gap: '5px',
					'& .ss__loadMore__progress__indicator': {
						width: '100%',
						maxWidth: `${progressIndicatorWidth}px`,
						background: backgroundColor || theme?.colors?.secondary || '#f8f8f8',
						borderRadius: `${progressIndicatorSize}px`,
						'& .ss__loadMore__progress__indicator__bar': {
							width: pagination ? `${(pagination.end / pagination.totalResults) * 100}%` : '',
							background: color || theme?.colors?.primary || '#ccc',
							borderRadius: `${progressIndicatorSize}px`,
							height: `${progressIndicatorSize}px`,
						},
					},
					'& .ss__loadMore__progress__text': {},
				},
			},
			'&.ss__loadMore--radial': {
				display: 'flex',
				alignItems: 'center',
				gap: '10px',
				'& .ss__loadMore__button': {
					height: 'fit-content',
				},
				'& .ss__loadMore__progress': {
					// remove height if progress indicator is hidden but hideProgressText is not
					height: !hideProgressText && hideProgressIndicator ? undefined : `${progressIndicatorWidth}px`,

					'& .ss__loadMore__progress__indicator': {
						'& .ss__loadMore__progress__indicator__radial': {
							'& .ss__loadMore__progress__indicator__radial__circle': {
								background: backgroundColor || theme?.colors?.secondary || '#f8f8f8',
								height: `${progressIndicatorWidth}px`,
								width: `${progressIndicatorWidth}px`,
								borderRadius: '50%',

								'& .ss__loadMore__progress__indicator__radial__circle__mask, .ss__loadMore__progress__indicator__radial__circle__mask__fill': {
									width: `${progressIndicatorWidth}px`,
									height: `${progressIndicatorWidth}px`,
									position: 'absolute',
									borderRadius: '50%',
								},
								'& .ss__loadMore__progress__indicator__radial__circle__mask': {
									clip: `rect(0px, ${progressIndicatorWidth}px, ${progressIndicatorWidth}px, ${progressIndicatorWidth! / 2}px)`,
								},
								'& .ss__loadMore__progress__indicator__radial__circle__mask__fill': {
									transform: `rotate(${radialAngle}deg)`,
								},
							},
							'& .ss__loadMore__progress__text': {
								width: `${progressIndicatorWidth! - progressIndicatorSize!}px`,
								height: `${progressIndicatorWidth! - progressIndicatorSize!}px`,
								borderRadius: '50%',
								background: '#fff',
								lineHeight: `${progressIndicatorWidth! - progressIndicatorSize!}px`,
								textAlign: 'center',
								marginTop: `${progressIndicatorSize! / 2}px`,
								marginLeft: `${progressIndicatorSize! / 2}px`,
								position: 'absolute',
								fontSize: `calc(${progressIndicatorWidth}px / ${Math.max(1, `${pagination!.end}`.length + `${pagination!.totalResults}`.length)})`,
							},
							'& .ss__loadMore__progress__indicator__radial__circle__mask': {
								'& .ss__loadMore__progress__indicator__radial__circle__mask__fill': {
									clip: `rect(0px, ${progressIndicatorWidth! / 2 + 0.5}px, ${progressIndicatorWidth}px, 0px)`,
									backgroundColor: color || theme?.colors?.primary || '#ccc',
								},
								'&.ss__loadMore__progress__indicator__radial__circle__mask--full': {
									transform: `rotate(${radialAngle}deg)`,
								},
							},
						},
					},
				},
			},
		});
	},
};

export const LoadMore = observer((properties: LoadMoreProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<LoadMoreProps> = {
		loadMoreText: 'Load More',
		progressIndicator: 'bar',
		progressIndicatorWidth: properties?.progressIndicator === 'radial' ? 70 : 300,
		progressIndicatorSize: properties?.progressIndicator === 'radial' ? 10 : 5,
	};

	const props = mergeProps('loadMore', globalTheme, defaultProps, properties);

	const {
		pagination,
		controller,
		onClick,
		autoFetch,
		intersectionOffset,
		loading,
		loadMoreText,
		progressIndicator,
		hideProgressIndicator,
		hideProgressText,
		disableStyles,
		className,
		style,
		styleScript,
	} = props;

	const subProps: LoadMoreSubProps = {
		button: {
			// default props
			className: 'ss__loadMore__button',
			// global theme
			...globalTheme?.components?.button,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const store = pagination || controller?.store?.pagination;
	const isLoading = typeof loading == 'boolean' ? loading : controller?.store?.loading;

	if (!store) {
		return <Fragment></Fragment>;
	}

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, pagination: store };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.LoadMore(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const autoProps: { ref?: MutableRef<null> } = {};
	if (autoFetch) {
		const loadMoreRef = useRef(null);
		autoProps.ref = loadMoreRef;

		const loadMoreInViewport = useIntersection(loadMoreRef, intersectionOffset || '0px');
		if (loadMoreInViewport && store.next) {
			store.next.url.go({ history: 'replace' });
		}
	}

	return store.totalResults ? (
		<CacheProvider>
			<div
				{...styling}
				{...autoProps}
				className={classnames(
					'ss__loadMore',
					`ss__loadMore--${progressIndicator}`,
					{ 'ss__loadMore--loading': isLoading },
					{ 'ss__loadMore--autoFetch': autoFetch },
					className
				)}
			>
				{!autoFetch && (
					<Button
						onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
							store.next?.url.go({ history: 'replace' });
							onClick && onClick(e);
						}}
						disabled={isLoading}
						icon={isLoading ? 'spinner' : undefined}
						aria-label={loadMoreText}
						{...subProps.button}
					>
						{loadMoreText}
					</Button>
				)}

				{(!hideProgressIndicator || !hideProgressText) && (
					<div className={'ss__loadMore__progress'}>
						{progressIndicator === 'bar' && (
							<Fragment>
								{!hideProgressIndicator && (
									<div className={'ss__loadMore__progress__indicator'}>
										<div className={`ss__loadMore__progress__indicator__bar`}></div>
									</div>
								)}
								{!hideProgressText && (
									<div className={'ss__loadMore__progress__text'}>
										You've viewed {store?.end} of {store?.totalResults} products
									</div>
								)}
							</Fragment>
						)}
						{progressIndicator === 'radial' && (
							<Fragment>
								{!hideProgressText && hideProgressIndicator ? (
									// displays text when progress indicator is hidden but hideProgressText is not
									<div className="ss__loadMore__progress__text">{`${store.end} / ${store.totalResults}`}</div>
								) : !hideProgressIndicator ? (
									<div className={'ss__loadMore__progress__indicator'}>
										<div className={`ss__loadMore__progress__indicator__radial`}>
											<div className="ss__loadMore__progress__indicator__radial__circle">
												<div className="ss__loadMore__progress__indicator__radial__circle__mask ss__loadMore__progress__indicator__radial__circle__mask--full">
													<div className="ss__loadMore__progress__indicator__radial__circle__mask__fill"></div>
												</div>
												<div className="ss__loadMore__progress__indicator__radial__circle__mask ss__loadMore__progress__indicator__radial__circle__mask--half">
													<div className="ss__loadMore__progress__indicator__radial__circle__mask__fill"></div>
												</div>
												<div className="ss__loadMore__progress__text"> {!hideProgressText ? `${store.end} / ${store.totalResults}` : ''}</div>
											</div>
										</div>
									</div>
								) : (
									<Fragment></Fragment>
								)}
							</Fragment>
						)}
					</div>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface LoadMoreSubProps {
	button: Partial<ButtonProps>;
}

export interface LoadMoreProps extends ComponentProps {
	pagination?: SearchPaginationStore;
	controller?: SearchController;
	autoFetch?: boolean;
	intersectionOffset?: string;
	loading?: boolean;
	loadMoreText?: string;
	color?: string;
	backgroundColor?: string;
	progressIndicator?: 'bar' | 'radial';
	progressIndicatorWidth?: number;
	progressIndicatorSize?: number;
	hideProgressIndicator?: boolean;
	hideProgressText?: boolean;
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
