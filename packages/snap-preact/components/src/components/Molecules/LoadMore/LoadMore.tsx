import { h, Fragment } from 'preact';
import { MutableRef, useRef, useState } from 'preact/hooks';
import { jsx, css, keyframes } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Lang, useIntersection, useLang } from '../../../hooks';
import type { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { useFuncDebounce } from '../../../hooks';
import deepmerge from 'deepmerge';

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
		const radialAngle = Math.max(3.6, ((360 / 100) * Math.floor((pagination!.end / pagination!.totalResults) * 100)) / 2);

		return css({
			'& .ss__load-more__button--disabled': {
				opacity: 0.7,
				borderColor: 'rgba(51,51,51,0.7)',
				backgroundColor: 'initial',
				pointerEvents: 'none',
				'&:hover': {
					cursor: 'default',
				},
			},
			'& .ss__load-more__button--hidden': {
				display: 'none',
			},
			'& .ss__button': {
				alignItems: 'center',
			},
			'& .ss__load-more__icon': {
				marginLeft: '5px',
				animation: `${keyframes({
					'0%': { transform: `rotate(0deg)` },
					'100%': { transform: `rotate(360deg)` },
				})} linear 1s infinite`,
			},
			'&.ss__load-more--bar': {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '20px',
				'& .ss__load-more__progress': {
					display: 'flex',
					flexDirection: 'column',
					gap: '5px',
					'& .ss__load-more__progress__indicator': {
						width: progressIndicatorWidth,
						background: backgroundColor || theme?.variables?.colors?.secondary || '#f8f8f8',
						borderRadius: progressIndicatorSize,
						'& .ss__load-more__progress__indicator__bar': {
							width: pagination ? `${(pagination.end / pagination.totalResults) * 100}%` : '',
							background: color || theme?.variables?.colors?.primary || '#ccc',
							borderRadius: progressIndicatorSize,
							height: progressIndicatorSize,
						},
					},
					'& .ss__load-more__progress__text': {
						textAlign: 'center',
					},
				},
			},
			'&.ss__load-more--radial': {
				display: 'flex',
				alignItems: 'center',
				gap: '10px',
				'& .ss__load-more__button': {
					height: 'fit-content',
				},
				'& .ss__load-more__progress': {
					// remove height if progress indicator is hidden but hideProgressText is not
					height: !hideProgressText && hideProgressIndicator ? undefined : progressIndicatorWidth,

					'& .ss__load-more__progress__indicator': {
						'& .ss__load-more__progress__indicator__radial': {
							background: backgroundColor || theme?.variables?.colors?.secondary || '#f8f8f8',
							height: progressIndicatorWidth,
							width: progressIndicatorWidth,
							borderRadius: '50%',

							'& .ss__load-more__progress__indicator__radial__mask, .ss__load-more__progress__indicator__radial__mask__fill': {
								width: progressIndicatorWidth,
								height: progressIndicatorWidth,
								position: 'absolute',
								borderRadius: '50%',
							},
							'& .ss__load-more__progress__indicator__radial__mask': {
								clipPath: `inset(0px 0px 0px calc(${progressIndicatorWidth}/2))`,
							},
							'& .ss__load-more__progress__indicator__radial__mask__fill': {
								transform: `rotate(${radialAngle}deg)`,
							},
						},
						'& .ss__load-more__progress__text': {
							width: `calc(${progressIndicatorWidth} - ${progressIndicatorSize})`,
							height: `calc(${progressIndicatorWidth} - ${progressIndicatorSize})`,
							borderRadius: '50%',
							background: '#fff',
							lineHeight: `calc(${progressIndicatorWidth} - ${progressIndicatorSize})`,
							textAlign: 'center',
							marginTop: `calc(${progressIndicatorSize} / 2)`,
							marginLeft: `calc(${progressIndicatorSize} / 2)`,
							position: 'absolute',
							fontSize: `calc(${progressIndicatorWidth} / ${Math.max(1, `${pagination!.end}`.length + `${pagination!.totalResults}`.length)})`,
						},
						'& .ss__load-more__progress__indicator__radial__mask': {
							'& .ss__load-more__progress__indicator__radial__mask__fill': {
								clipPath: `inset(0px calc((${progressIndicatorWidth} / 2)) 0px 0px)`,
								backgroundColor: color || theme?.variables?.colors?.primary || '#ccc',
							},
							'&.ss__load-more__progress__indicator__radial__mask--full': {
								transform: `rotate(${radialAngle}deg)`,
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
		loadingLocation: 'button',
		loadingIcon: 'spinner',
		progressIndicatorWidth: properties?.progressIndicator === 'radial' ? '70px' : '300px',
		progressIndicatorSize: properties?.progressIndicator === 'radial' ? '10px' : '5px',
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
		loadingLocation,
		loadingIcon,
		disableStyles,
		className,
		style,
		styleScript,
		treePath,
	} = props;

	const store = pagination || controller?.store?.pagination;
	const isLoading = typeof loading == 'boolean' ? loading : controller?.store?.loading;
	const isButtonDisabled = (isLoading && loadingLocation === 'button') || !Boolean(store?.next);

	const subProps: LoadMoreSubProps = {
		button: {
			// default props
			className: classnames(
				'ss__load-more__button',
				{ 'ss__load-more__button--hidden': isLoading && loadingLocation === 'outside' },
				{ 'ss__load-more__button--disabled': isButtonDisabled }
			),
			// global theme
			...globalTheme?.components?.button,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		icon: {
			// default props
			className: 'ss__load-more__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	if (!store) {
		return <Fragment></Fragment>;
	}

	const styling: RootNodeProperties = { 'ss-name': props.name };
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
		const [preventLoading, setPreventLoading] = useState(true);

		if (isLoading) {
			setPreventLoading(true);
		} else {
			useFuncDebounce(() => {
				setPreventLoading(false);
			}, 500);
		}

		if (loadMoreInViewport && store.next && !preventLoading) {
			store.next.url.go({ history: 'replace' });
		}
	}

	//initialize lang
	const defaultLang = {
		loadMoreButton: {
			value: loadMoreText,
			attributes: {
				'aria-label': loadMoreText,
			},
		},
		progressText: {
			value: `You've viewed ${store?.end} of ${store?.totalResults} products`,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		paginationStore: store,
	});

	return store.totalResults ? (
		<CacheProvider>
			<div
				{...styling}
				{...autoProps}
				className={classnames(
					'ss__load-more',
					`ss__load-more--${progressIndicator}`,
					{ 'ss__load-more--loading': isLoading },
					{ 'ss__load-more--autoFetch': autoFetch },
					className
				)}
			>
				{!autoFetch && (
					<Fragment>
						<Button
							onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
								store.next?.url.go({ history: 'replace' });
								onClick && onClick(e);
							}}
							{...subProps.button}
							{...mergedLang.loadMoreButton.attributes}
						>
							<span {...mergedLang.loadMoreButton.value}>{loadMoreText}</span>
							{loadingIcon && isLoading && loadingLocation === 'button' ? (
								<Icon {...subProps.icon} {...(typeof loadingIcon == 'string' ? { icon: loadingIcon } : (loadingIcon as Partial<IconProps>))} />
							) : (
								<Fragment></Fragment>
							)}
						</Button>

						{loadingIcon && isLoading && loadingLocation === 'outside' && (
							<Icon {...subProps.icon} {...(typeof loadingIcon == 'string' ? { icon: loadingIcon } : (loadingIcon as Partial<IconProps>))} />
						)}
					</Fragment>
				)}

				{(!hideProgressIndicator || !hideProgressText) && (
					<div className={'ss__load-more__progress'}>
						{progressIndicator === 'bar' && (
							<Fragment>
								{!hideProgressIndicator && (
									<div className={'ss__load-more__progress__indicator'}>
										<div className={`ss__load-more__progress__indicator__bar`}></div>
									</div>
								)}
								{!hideProgressText && (
									<div aria-atomic="true" aria-live="polite" className={'ss__load-more__progress__text'} {...mergedLang.progressText?.all}></div>
								)}
							</Fragment>
						)}
						{progressIndicator === 'radial' && (
							<Fragment>
								{!hideProgressText && hideProgressIndicator ? (
									// displays text when progress indicator is hidden but hideProgressText is not
									<div aria-atomic="true" aria-live="polite" className="ss__load-more__progress__text">{`${store.end} / ${store.totalResults}`}</div>
								) : !hideProgressIndicator ? (
									<div className={'ss__load-more__progress__indicator'}>
										<div className="ss__load-more__progress__indicator__radial">
											<div className="ss__load-more__progress__indicator__radial__mask ss__load-more__progress__indicator__radial__mask--full">
												<div className="ss__load-more__progress__indicator__radial__mask__fill"></div>
											</div>
											<div className="ss__load-more__progress__indicator__radial__mask ss__load-more__progress__indicator__radial__mask--half">
												<div className="ss__load-more__progress__indicator__radial__mask__fill"></div>
											</div>
											<div aria-atomic="true" aria-live="polite" className="ss__load-more__progress__text">
												{' '}
												{!hideProgressText ? `${store.end} / ${store.totalResults}` : ''}
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
	icon: Partial<IconProps>;
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
	progressIndicatorWidth?: string;
	progressIndicatorSize?: string;
	hideProgressIndicator?: boolean;
	hideProgressText?: boolean;
	loadingIcon?: IconType | Partial<IconProps>;
	loadingLocation?: 'button' | 'outside';
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	lang?: Partial<LoadMoreLang>;
}

export interface LoadMoreLang {
	loadMoreButton: Lang<{
		paginationStore: SearchPaginationStore;
	}>;
	progressText: Lang<{
		paginationStore: SearchPaginationStore;
	}>;
}
