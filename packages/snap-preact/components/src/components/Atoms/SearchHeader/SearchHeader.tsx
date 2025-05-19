import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps, mergeStyles } from '../../../utilities';
import { SearchMerchandisingStore, SearchPaginationStore, SearchQueryStore } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';
import { useLang } from '../../../hooks';
import type { Lang } from '../../../hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<SearchHeaderProps> = () => {
	return css({});
};

export const SearchHeader = observer((properties: SearchHeaderProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const landingPage = properties.controller?.store.merchandising.landingPage || properties.merchandising?.landingPage;

	const pagination = properties.controller?.store.pagination || properties.pagination;
	const search = properties.controller?.store.search || properties.query;

	const defaultProps: Partial<SearchHeaderProps> = {
		titleText: `Search results ${search?.query ? `for <span class="ss__search-header__results-query">"${search.query.string}"</span>` : ''}`,
		correctedQueryText: `No results found for <em>"${search?.originalQuery?.string}"</em>, showing results for <em>"${search?.query?.string}"</em> instead.`,
		didYouMeanText: `Did you mean <a href=${search?.didYouMean?.url.href}>${search?.didYouMean?.string}</a>?`,
		noResultsText: `${
			search?.query
				? `<span>
			No results for <span class="ss__search-header__results-query">"${search.query.string}"</span> found.
		</span>`
				: `<span>No results found.</span>`
		}`,
		expandedSearchText: `We couldn't find an exact match for "<span class="ss__search-header__results-query">${search?.query?.string}</span>", but here's something similar:`,
		treePath: globalTreePath,
	};

	const props = mergeProps('searchHeader', globalTheme, defaultProps, properties);

	const {
		className,
		titleText,
		subtitleText,
		correctedQueryText,
		noResultsText,
		didYouMeanText,
		expandedSearchText,
		hideTitleText,
		hideSubtitleText,
		hideCorrectedQueryText,
		hideNoResultsText,
		hideExpandedSearchText,
		hideDidYouMeanText,
	} = props;

	const styling = mergeStyles<SearchHeaderProps>(props, defaultStyles);

	//initialize lang
	const defaultLang = {
		titleText: {
			value: titleText,
		},
		subtitleText: {
			value: subtitleText,
		},
		correctedQueryText: {
			value: correctedQueryText,
		},
		noResultsText: {
			value: noResultsText,
		},
		didYouMeanText: {
			value: didYouMeanText,
		},
		expandedSearchText: {
			value: expandedSearchText,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(
		lang as any,
		{
			pagination: pagination,
			search: search,
		} as SearchHeaderPropData
	);

	return (
		<CacheProvider>
			<header {...styling} className={classnames('ss__search-header', className)}>
				{landingPage ? (
					<h3 className={classnames('ss__search-header__title', 'ss__search-header__title--landing-page')}>{landingPage.title}</h3>
				) : (
					<Fragment>
						{pagination?.totalResults ? (
							<>
								{!hideExpandedSearchText && search?.matchType && search.matchType == 'expanded' ? (
									<h3
										className={classnames('ss__search-header__title', 'ss__search-header__title--expanded')}
										aria-atomic="true"
										aria-live="polite"
										{...mergedLang.expandedSearchText?.all}
									></h3>
								) : (
									<></>
								)}

								{!hideTitleText && search?.matchType !== 'expanded' && (
									<h3
										className={classnames('ss__search-header__title', 'ss__search-header__title--results')}
										aria-atomic="true"
										aria-live="polite"
										{...mergedLang.titleText?.all}
									></h3>
								)}

								{search?.originalQuery && !hideCorrectedQueryText && (
									<h5
										className={classnames('ss__search-header__subtitle', 'ss__search-header__subtitle--corrected')}
										aria-atomic="true"
										aria-live="polite"
										{...mergedLang.correctedQueryText?.all}
									></h5>
								)}
							</>
						) : (
							pagination?.totalResults === 0 && (
								<div className="ss__search-header__no-results-wrapper">
									{!hideNoResultsText && (
										<h3
											className={classnames('ss__search-header__title', 'ss__search-header__title--no-results')}
											aria-atomic="true"
											aria-live="polite"
											{...mergedLang.noResultsText?.all}
										></h3>
									)}

									{search?.didYouMean && !hideDidYouMeanText && (
										<h5
											className={classnames('ss__search-header__subtitle', 'ss__search-header__subtitle--dym')}
											aria-atomic="true"
											aria-live="polite"
											{...mergedLang.didYouMeanText?.all}
										></h5>
									)}
								</div>
							)
						)}

						{(subtitleText || lang.subtitleText.value) && !hideSubtitleText && (
							<h5 className={classnames('ss__search-header__subtitle')} aria-atomic="true" aria-live="polite" {...mergedLang.subtitleText?.all}></h5>
						)}
					</Fragment>
				)}
			</header>
		</CacheProvider>
	);
});

export interface SearchHeaderProps extends ComponentProps {
	controller?: SearchController;
	query?: SearchQueryStore;
	pagination?: SearchPaginationStore;
	merchandising?: SearchMerchandisingStore;

	titleText?: string | ((data: SearchHeaderPropData) => string);
	subtitleText?: string | ((data: SearchHeaderPropData) => string);
	correctedQueryText?: string | ((data: SearchHeaderPropData) => string);
	noResultsText?: string | ((data: SearchHeaderPropData) => string);
	didYouMeanText?: string | ((data: SearchHeaderPropData) => string);
	expandedSearchText?: string | ((data: SearchHeaderPropData) => string);
	hideTitleText?: boolean;
	hideSubtitleText?: boolean;
	hideCorrectedQueryText?: boolean;
	hideNoResultsText?: boolean;
	hideDidYouMeanText?: boolean;
	hideExpandedSearchText?: boolean;
	lang?: Partial<SearchHeaderLang>;
}

export interface SearchHeaderLang {
	titleText: Lang<SearchHeaderPropData>;
	correctedQueryText: Lang<SearchHeaderPropData>;
	noResultsText: Lang<SearchHeaderPropData>;
	didYouMeanText: Lang<SearchHeaderPropData>;
	expandedSearchText: Lang<SearchHeaderPropData>;
	subtitleText?: Lang<SearchHeaderPropData>;
}

interface SearchHeaderPropData {
	pagination?: SearchPaginationStore;
	search?: SearchQueryStore;
}
