/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { SearchController } from '@searchspring/snap-controller';

const CSS = {
	searchheader: () => css(),
};

export const SearchHeader = observer((properties: SearchHeaderProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: SearchHeaderProps = {
		// default props
		// global theme
		...globalTheme?.components?.searchheader,
		// props
		...properties,
		...properties.theme?.components?.searchheader,
	};
	const { controller, searchTitle, noResultsTitle, disableStyles, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.searchheader(), style];
	} else if (style) {
		styling.css = [style];
	}

	const landingPage = controller.store.merchandising.landingPage;
	const { pagination, search } = controller.store;

	return (
		<CacheProvider>
			<header className="ss-header-container">
				{landingPage ? (
					<h3 className="ss__search-header--landingPageTitle">{landingPage.title}</h3>
				) : (
					<Fragment>
						{pagination.totalResults ? (
							searchTitle ? (
								searchTitle
							) : (
								<h3
									className="ss-title ss-results-title"
									aria-atomic="true"
									aria-live="polite"
									aria-label={`Now showing ${pagination.totalResults} items in the product grid`}
								>
									{`Showing `}
									{pagination.multiplePages && <span className="ss-results-count-range">{` ${pagination.begin} - ${pagination.end} of `}</span>}
									<span className="ss-results-count-total">{pagination.totalResults}</span>
									{` result${pagination.totalResults == 1 ? '' : 's'}`}
									{search?.query && (
										<span>
											{` for `}
											<span className="ss-results-query">"{search.query.string}"</span>
										</span>
									)}
									{search?.originalQuery && (
										<div className="ss-oq">
											No results found for <em>"{search.originalQuery.string}"</em>, showing results for <em>"{search.query?.string}"</em> instead.
										</div>
									)}
								</h3>
							)
						) : (
							pagination.totalResults === 0 && (
								<h3 className="ss-title ss-results-title ss-no-results-title">
									{noResultsTitle ? (
										{ noResultsTitle }
									) : search?.query ? (
										<span>
											No results for <span className="ss-results-query">"{search.query.string}"</span> found.
										</span>
									) : (
										<span>No results found.</span>
									)}
								</h3>
							)
						)}
					</Fragment>
				)}
			</header>
		</CacheProvider>
	);
});

export interface SearchHeaderProps extends ComponentProps {
	//this needs customizable things and stuff
	searchTitle?: string;
	noResultsTitle?: string;
	controller: SearchController;
}
