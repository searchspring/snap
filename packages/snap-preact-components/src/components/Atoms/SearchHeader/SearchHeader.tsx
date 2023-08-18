/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { SearchMerchandisingStore, SearchPaginationStore, SearchQueryStore } from '@searchspring/snap-store-mobx';
import classNames from 'classnames';

const CSS = {
	searchheader: () => css(),
};

export const SearchHeader = observer((properties: SearchHeaderProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const landingPage = properties.controller?.store.merchandising.landingPage || properties.merchandisingStore?.landingPage;

	const pagination = properties.controller?.store.pagination || properties.paginationStore;
	const search = properties.controller?.store.search || properties.queryStore;

	const defaultProps: Partial<SearchHeaderProps> = {
		titleText: `Showing ${
			pagination?.multiplePages ? `<span class="ss__search-header__results-count-range"> ${pagination?.begin} - ${pagination?.end} of </span>` : ''
		} 
		<span class="ss__search-header__results-count-total">${pagination?.totalResults}</span> 
		result${pagination?.totalResults == 1 ? '' : 's'} 
		${search?.query ? `for <span class="ss__search-header__results-query">"${search.query.string}"</span>` : ''}
	`,
		correctedQueryText: `No results found for <em>"${search?.originalQuery?.string}"</em>, showing results for <em>"${search?.query?.string}"</em> instead.`,
		noResultsText: `${
			search?.query
				? `<span>
			No results for <span class="ss__search-header__results-query">"${search.query.string}"</span> found.
		</span>`
				: `<span>No results found.</span>`
		}`,
	};

	const props = mergeProps('searchHeader', globalTheme, defaultProps, properties);

	const { disableStyles, style, className } = props;

	let { titleText, subtitleText: subTitleText, correctedQueryText, noResultsText } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.searchheader(), style];
	} else if (style) {
		styling.css = [style];
	}

	const data: data = {
		pagination: pagination,
		search: search,
	};

	if (typeof titleText == 'function') {
		titleText = titleText(data);
	}
	if (typeof subTitleText == 'function') {
		subTitleText = subTitleText(data);
	}
	if (typeof correctedQueryText == 'function') {
		correctedQueryText = correctedQueryText(data);
	}
	if (typeof noResultsText == 'function') {
		noResultsText = noResultsText(data);
	}

	return (
		<CacheProvider>
			<header {...styling} className={classNames('ss__search-header', className)}>
				{landingPage ? (
					<h3 className={classNames('ss__search-header__title', 'ss__search-header__title--landing-page')}>{landingPage.title}</h3>
				) : (
					<Fragment>
						{pagination?.totalResults ? (
							<>
								<h3
									className={classNames('ss__search-header__title', 'ss__search-header__title--results')}
									aria-atomic="true"
									aria-live="polite"
									aria-label={`Now showing ${pagination.totalResults} items in the product grid`}
									dangerouslySetInnerHTML={{ __html: titleText as string }}
								></h3>

								{search?.originalQuery && (
									<h5
										className={classNames('ss__search-header__title', 'ss__search-header__title--corrected')}
										aria-atomic="true"
										aria-live="polite"
										aria-label={`No results found for ${search.originalQuery?.string}, showing results for ${search.query?.string} instead`}
										dangerouslySetInnerHTML={{ __html: correctedQueryText as string }}
									></h5>
								)}
							</>
						) : (
							pagination?.totalResults === 0 && (
								<h3
									className={classNames('ss__search-header__title', 'ss__search-header__title--no-results')}
									aria-atomic="true"
									aria-live="polite"
									aria-label={`No results found for ${search?.query?.string}`}
									dangerouslySetInnerHTML={{ __html: noResultsText as string }}
								></h3>
							)
						)}

						{subTitleText && (
							<h4
								className={classNames('ss__search-header__title', 'ss__search-header__title--subtitle')}
								aria-atomic="true"
								aria-live="polite"
								dangerouslySetInnerHTML={{ __html: subTitleText as string }}
							></h4>
						)}
					</Fragment>
				)}
			</header>
		</CacheProvider>
	);
});

export interface SearchHeaderProps extends ComponentProps {
	controller?: SearchController;
	queryStore?: SearchQueryStore;
	paginationStore?: SearchPaginationStore;
	merchandisingStore?: SearchMerchandisingStore;

	titleText?: string | ((data: data) => string);
	subtitleText?: string | ((data: data) => string);
	correctedQueryText?: string | ((data: data) => string);
	noResultsText?: string | ((data: data) => string);
}

interface data {
	pagination?: SearchPaginationStore;
	search?: SearchQueryStore;
}
