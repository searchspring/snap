import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';
import { SearchMerchandisingStore, SearchPaginationStore, SearchQueryStore } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';
import { useLang } from '../../../hooks';
import type { Lang } from '../../../hooks';
import deepmerge from 'deepmerge';

const CSS = {
	searchheader: ({}: Partial<SearchHeaderProps>) => css({}),
};

export const SearchHeader = observer((properties: SearchHeaderProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const landingPage = properties.controller?.store.merchandising.landingPage || properties.merchandising?.landingPage;

	const pagination = properties.controller?.store.pagination || properties.pagination;
	const search = properties.controller?.store.search || properties.query;

	const defaultProps: Partial<SearchHeaderProps> = {
		titleText: `Showing ${
			pagination?.multiplePages ? `<span class="ss__search-header__results-count-range"> ${pagination?.begin} - ${pagination?.end} of </span>` : ''
		} 
		<span class="ss__search-header__results-count-total">${pagination?.totalResults}</span> 
		result${pagination?.totalResults == 1 ? '' : 's'} 
		${search?.query ? `for <span class="ss__search-header__results-query">"${search.query.string}"</span>` : ''}
	`,
		correctedQueryText: `No results found for <em>"${search?.originalQuery?.string}"</em>, showing results for <em>"${search?.query?.string}"</em> instead.`,
		didYouMeanText: `Did you mean <a href=${search?.didYouMean?.url.href}>${search?.didYouMean?.string}</a>?`,
		noResultsText: `${
			search?.query
				? `<span>
			No results for <span class="ss__search-header__results-query">"${search.query.string}"</span> found.
		</span>`
				: `<span>No results found.</span>`
		}`,
	};

	const props = mergeProps('searchHeader', globalTheme, defaultProps, properties);
	const { disableStyles, style, styleScript, className } = props;

	const {
		titleText,
		subtitleText,
		correctedQueryText,
		noResultsText,
		didYouMeanText,
		hideTitleText,
		hideSubtitleText,
		hideCorrectedQueryText,
		hideNoResultsText,
		hideDidYouMeanText,
	} = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.searchheader(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	//initialize lang
	const defaultLang = {
		titleText: {
			value: titleText,
			attributes: {
				'aria-label': `Now showing ${pagination?.totalResults} items in the product grid`,
			},
		},
		subtitleText: {
			value: subtitleText,
		},
		correctedQueryText: {
			value: correctedQueryText,
			attributes: {
				'aria-label': `No results found for ${search?.originalQuery?.string}, showing results for ${search?.query?.string} instead`,
			},
		},
		noResultsText: {
			value: noResultsText,
			attributes: {
				'aria-label': `No results found for ${search?.query?.string}`,
			},
		},
		didYouMeanText: {
			value: didYouMeanText,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		pagination: pagination,
		search: search,
	});

	return (
		<CacheProvider>
			<header {...styling} className={classnames('ss__search-header', className)}>
				{landingPage ? (
					<h3 className={classnames('ss__search-header__title', 'ss__search-header__title--landing-page')}>{landingPage.title}</h3>
				) : (
					<Fragment>
						{pagination?.totalResults ? (
							<>
								{!hideTitleText && (
									<h3
										className={classnames('ss__search-header__title', 'ss__search-header__title--results')}
										aria-atomic="true"
										aria-live="polite"
										{...mergedLang.titleText?.all}
									></h3>
								)}

								{search?.originalQuery && !hideCorrectedQueryText && (
									<h5
										className={classnames('ss__search-header__title', 'ss__search-header__title--corrected')}
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
										<h4
											className={classnames('ss__search-header__title', 'ss__search-header__title--dym')}
											aria-atomic="true"
											aria-live="polite"
											{...mergedLang.didYouMeanText?.all}
										></h4>
									)}
								</div>
							)
						)}

						{(subtitleText || lang.subtitleText.value) && !hideSubtitleText && (
							<h4
								className={classnames('ss__search-header__title', 'ss__search-header__title--subtitle')}
								aria-atomic="true"
								aria-live="polite"
								{...mergedLang.subtitleText?.all}
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
	query?: SearchQueryStore;
	pagination?: SearchPaginationStore;
	merchandising?: SearchMerchandisingStore;

	titleText?: string | ((data: SearchHeaderPropData) => string);
	subtitleText?: string | ((data: SearchHeaderPropData) => string);
	correctedQueryText?: string | ((data: SearchHeaderPropData) => string);
	noResultsText?: string | ((data: SearchHeaderPropData) => string);
	didYouMeanText?: string | ((data: SearchHeaderPropData) => string);
	hideTitleText?: boolean;
	hideSubtitleText?: boolean;
	hideCorrectedQueryText?: boolean;
	hideNoResultsText?: boolean;
	hideDidYouMeanText?: boolean;

	lang?: Partial<SearchHeaderLang>;
}

export interface SearchHeaderLang {
	titleText: Lang<SearchHeaderPropData>;
	correctedQueryText: Lang<SearchHeaderPropData>;
	noResultsText: Lang<SearchHeaderPropData>;
	didYouMeanText: Lang<SearchHeaderPropData>;
	subtitleText?: Lang<SearchHeaderPropData>;
}

interface SearchHeaderPropData {
	pagination?: SearchPaginationStore;
	query?: SearchQueryStore;
}
