/** @jsx jsx */
import { h, Fragment } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider, cache } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	pagination: ({ theme, style }) =>
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
					backgroundColor: theme.colors?.hover || '#f8f8f8',
				},
			},
			...style,
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
			...props.theme?.components?.icon,
		},
	};

	const store = pagination;
	const getPagesParams = Number.isInteger(pagesLeft) && Number.isInteger(pagesRight) ? [pagesLeft, pagesRight] : [pages];
	const _pages = store?.getPages(...getPagesParams);
	const pageNumbers = _pages?.map((page) => page.number);

	return (
		store?.totalResults && (
			<CacheProvider value={cache}>
				<div css={!disableStyles && CSS.pagination({ theme, style })} className={classnames('ss__pagination', className)}>
					<>
						{/* Prev */}
						{store.previous && !hidePrev && (
							<a {...store.previous.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--previous')}>
								{prevButton ? prevButton : <Icon {...subProps.icon} icon={'angle-left'} />}
							</a>
						)}

						{/* first */}
						{!pageNumbers.includes(store.first.number) && !hideFirst && (
							<>
								<a {...store.first.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--first')}>
									{firstButton ? firstButton : store.first.number}
								</a>
								{!pageNumbers.includes(2) && !hideEllipsis && <span>&hellip;</span>}
							</>
						)}

						{/* pages */}
						{_pages &&
							_pages.map((page) =>
								page.active ? (
									<span className={classnames('ss__pagination__page', 'ss__pagination__page--active')}>{page.number}</span>
								) : (
									<a {...page.url.link} className="ss__pagination__page">
										{page.number}
									</a>
								)
							)}

						{/* last page */}
						{!pageNumbers.includes(store.last.number) && !hideLast && (
							<>
								{!pageNumbers.includes(store.totalPages - 1) && !hideEllipsis && <span>&hellip;</span>}

								<a {...store.last.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--last')}>
									{lastButton ? lastButton : store.last.number}
								</a>
							</>
						)}

						{/* next */}
						{store.next && !hideNext && (
							<a {...store.next.url.link} className={classnames('ss__pagination__page', 'ss__pagination__page--next')}>
								{nextButton ? nextButton : <Icon {...subProps.icon} icon={'angle-right'} />}
							</a>
						)}
					</>
				</div>
			</CacheProvider>
		)
	);
});

interface PaginationSubProps {
	icon: IconProps;
}

// TODO: possibly lower num of props
export interface PaginationProps extends ComponentProps {
	pagination: any; //TODO: update pagination mock data, 'any' to pass pagination tests
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
