import { h, Fragment } from 'preact';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Icon, IconProps } from '../../Atoms/Icon';
import type { SearchPaginationStore, Page } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import deepmerge from 'deepmerge';
import { lang, useLang } from '../../../hooks';

const CSS = {
	pagination: ({ theme }: Partial<PaginationProps>) =>
		css({
			'& .ss__pagination__page': {
				padding: '5px',
				display: 'inline-block',
				minHeight: '1em',
				minWidth: '1em',
				textAlign: 'center',
				'&.ss__pagination__page--active': {
					fontWeight: 'bold',
				},
				'&:hover:not(.ss__pagination__page--active)': {
					backgroundColor: theme?.variables?.color?.hover?.background || '#f8f8f8',
				},
			},
		}),
};

export const Pagination = observer((properties: PaginationProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<PaginationProps> = {
		pages: 5,
	};

	const props = mergeProps('pagination', globalTheme, defaultProps, properties);

	const {
		pagination,
		controller,
		pages,
		pagesLeft,
		pagesRight,
		hideFirst,
		hideLast,
		hideEllipsis,
		hideNext,
		hidePrev,
		nextButton,
		prevButton,
		firstButton,
		lastButton,
		disableStyles,
		className,
		style,
		styleScript,
	} = props;

	const subProps: PaginationSubProps = {
		icon: {
			// default props
			className: 'ss__pagination__icon',
			size: '10px',
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

	const store = pagination || controller?.store?.pagination;

	const getPagesParams = Number.isInteger(pagesLeft) && Number.isInteger(pagesRight) ? [pagesLeft, pagesRight] : [pages];
	const _pages = store?.getPages(...getPagesParams);
	const pageNumbers = _pages?.map((page) => page.number);

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.pagination(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	//initialize lang
	const defaultLang = {
		previous: {
			attributes: {
				'aria-label': 'go to previous page',
			},
		},
		next: {
			attributes: {
				'aria-label': 'go to next page',
			},
		},
		first: {
			attributes: {
				'aria-label': 'go to first page',
			},
		},
		last: {
			attributes: {
				'aria-label': `go to last page ${store?.last.number}`,
			},
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		paginationStore: store,
	});

	return pageNumbers && store?.totalResults ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__pagination', className)}>
				<nav role="navigation" aria-label="Pagination">
					{/* Prev */}
					{store.previous && !hidePrev && (
						<a {...store.previous.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--previous')} {...mergedLang.previous}>
							{prevButton ? prevButton : <Icon {...subProps.icon} icon={'angle-left'} />}
						</a>
					)}

					{/* first */}
					{!pageNumbers.includes(store.first.number) && !hideFirst && (
						<>
							<a {...store.first.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--first')} {...mergedLang.first}>
								{firstButton ? firstButton : store.first.number}
							</a>
							{!pageNumbers.includes(2) && !hideEllipsis && <span>&hellip;</span>}
						</>
					)}

					{/* pages */}
					{_pages &&
						_pages.map((page) => {
							//initialize lang
							const defaultPageLang = {
								page: {
									attributes: {
										'aria-label': `go to page ${page.number}`,
									},
								},
							};

							//deep merge with props.lang
							const pagelang = deepmerge(defaultPageLang, props.lang || {});
							const mergedPageLang = useLang(pagelang as any, {
								paginationStore: store,
								page: page,
							});

							return page.active ? (
								<span className={classnames('ss__pagination__page', 'ss__pagination__page--active')} {...mergedPageLang.page} aria-current="true">
									{page.number}
								</span>
							) : (
								<a {...page.url.link} className="ss__pagination__page" {...mergedPageLang.page}>
									{page.number}
								</a>
							);
						})}

					{/* last page */}
					{!pageNumbers.includes(store.last.number) && !hideLast && (
						<>
							{!pageNumbers.includes(store.totalPages - 1) && !hideEllipsis && <span>&hellip;</span>}

							<a {...store.last.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--last')} {...mergedLang.last}>
								{lastButton ? lastButton : store.last.number}
							</a>
						</>
					)}

					{/* next */}
					{store.next && !hideNext && (
						<a {...store.next.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--next')} {...mergedLang.next}>
							{nextButton ? nextButton : <Icon {...subProps.icon} icon={'angle-right'} />}
						</a>
					)}
				</nav>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface PaginationSubProps {
	icon: IconProps;
}

export interface PaginationProps extends ComponentProps {
	pagination?: SearchPaginationStore;
	controller?: SearchController;
	pages?: number;
	pagesLeft?: number;
	pagesRight?: number;
	hideFirst?: boolean;
	hideLast?: boolean;
	hideEllipsis?: boolean;
	hideNext?: boolean;
	hidePrev?: boolean;
	nextButton?: string | JSX.Element;
	prevButton?: string | JSX.Element;
	firstButton?: string | JSX.Element;
	lastButton?: string | JSX.Element;
	lang?: Partial<PaginationLang>;
}

export interface PaginationLang {
	previous: lang<{
		paginationStore: SearchPaginationStore;
	}>;
	next: lang<{
		paginationStore: SearchPaginationStore;
	}>;
	first: lang<{
		paginationStore: SearchPaginationStore;
	}>;
	last: lang<{
		paginationStore: SearchPaginationStore;
	}>;
	page: lang<{
		paginationStore: SearchPaginationStore;
		page: Page;
	}>;
}
