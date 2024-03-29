/** @jsx jsx */
import { h, Fragment } from 'preact';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Icon, IconProps } from '../../Atoms/Icon';
import type { SearchPaginationStore } from '@searchspring/snap-store-mobx';

const CSS = {
	pagination: ({ theme }: { theme: Theme }) =>
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
					backgroundColor: theme?.colors?.hover || '#f8f8f8',
				},
			},
		}),
};

export const Pagination = observer((properties: PaginationProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: PaginationProps = {
		// default props
		pages: 5,
		// global theme
		...globalTheme?.components?.pagination,
		// props
		...properties,
		...properties.theme?.components?.pagination,
	};

	const {
		pagination,
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

	const store = pagination;
	const getPagesParams = Number.isInteger(pagesLeft) && Number.isInteger(pagesRight) ? [pagesLeft, pagesRight] : [pages];
	const _pages = store?.getPages(...getPagesParams);
	const pageNumbers = _pages?.map((page) => page.number);

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.pagination({ theme }), style];
	} else if (style) {
		styling.css = [style];
	}
	return store?.totalResults ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__pagination', className)}>
				<nav role="navigation" aria-label="Pagination">
					{/* Prev */}
					{store.previous && !hidePrev && (
						<a
							{...store.previous.url.link}
							className={classnames('ss__pagination__page', 'ss__pagination__page--previous')}
							aria-label={'go to previous page'}
						>
							{prevButton ? prevButton : <Icon {...subProps.icon} icon={'angle-left'} />}
						</a>
					)}

					{/* first */}
					{!pageNumbers.includes(store.first.number) && !hideFirst && (
						<>
							<a
								{...store.first.url.link}
								className={classnames('ss__pagination__page', 'ss__pagination__page--first')}
								aria-label={'go to first page'}
							>
								{firstButton ? firstButton : store.first.number}
							</a>
							{!pageNumbers.includes(2) && !hideEllipsis && <span>&hellip;</span>}
						</>
					)}

					{/* pages */}
					{_pages &&
						_pages.map((page) =>
							page.active ? (
								<span
									className={classnames('ss__pagination__page', 'ss__pagination__page--active')}
									aria-label={`go to page ${page.number}`}
									aria-current="true"
								>
									{page.number}
								</span>
							) : (
								<a {...page.url.link} className="ss__pagination__page" aria-label={`go to page ${page.number}`}>
									{page.number}
								</a>
							)
						)}

					{/* last page */}
					{!pageNumbers.includes(store.last.number) && !hideLast && (
						<>
							{!pageNumbers.includes(store.totalPages - 1) && !hideEllipsis && <span>&hellip;</span>}

							<a
								{...store.last.url.link}
								className={classnames('ss__pagination__page', 'ss__pagination__page--last')}
								aria-label={`go to last page ${store.last.number}`}
							>
								{lastButton ? lastButton : store.last.number}
							</a>
						</>
					)}

					{/* next */}
					{store.next && !hideNext && (
						<a {...store.next.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--next')} aria-label={'go to next page'}>
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
	pagination: SearchPaginationStore;
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
}
