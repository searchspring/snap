import { h, Fragment } from 'preact';
import { MutableRef, useRef, useState } from 'preact/hooks';
import { jsx, css, keyframes } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Lang, useIntersection, useLang } from '../../../hooks';
import type { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { useFuncDebounce } from '../../../hooks';

const defaultStyles: StyleScript<LoadMoreProps> = ({ pagination, progressIndicatorWidth, progressIndicatorSize, color, backgroundColor, theme }) => {
	return css({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '20px',

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
		'&.ss__load-more': {
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
	});
};

export const LoadMore = observer((properties: LoadMoreProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const defaultProps: Partial<LoadMoreProps> = {
		loadMoreText: 'Load More',
		loadingLocation: 'button',
		loadingIcon: 'spinner',
		progressIndicatorWidth: '300px',
		progressIndicatorSize: '5px',
		treePath: globalTreePath,
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
		hideProgressIndicator,
		hideProgressText,
		loadingLocation,
		loadingIcon,
		disableStyles,
		className,
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

	const styling = mergeStyles<LoadMoreProps>({ ...props, pagination: store }, defaultStyles);

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
		pagination: store,
	});

	return store.totalResults ? (
		<CacheProvider>
			<div
				{...styling}
				{...autoProps}
				className={classnames('ss__load-more', { 'ss__load-more--loading': isLoading }, { 'ss__load-more--autoFetch': autoFetch }, className)}
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
		pagination: SearchPaginationStore;
	}>;
	progressText: Lang<{
		pagination: SearchPaginationStore;
	}>;
}
