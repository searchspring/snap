/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import type { SearchController } from '@searchspring/snap-controller';
import { mergeProps } from '../../../utilities';

const CSS = {
	searchheader: () => css(),
};

export const SearchHeader = observer((properties: SearchHeaderProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const landingPage = properties.controller.store.merchandising.landingPage;
	const { pagination, search } = properties.controller.store;

	const defaultProps: Partial<SearchHeaderProps> = {
		titleText: `Showing ${pagination.multiplePages ? `<span class="ss-results-count-range"> ${pagination.begin} - ${pagination.end} of </span>` : ''} 
		<span class="ss-results-count-total">${pagination.totalResults}</span> 
		result${pagination.totalResults == 1 ? '' : 's'} 
		${search?.query ? `<span>for <span class="ss-results-query">"${search.query.string}"</span></span>` : ''}
	`,
		oqText: `<div class="ss-oq">No results found for <em>"${search.originalQuery?.string}"</em>, showing results for <em>"${search.query?.string}"</em> instead.</div>`,
		noResultsText: `${
			search?.query
				? `<span>
			No results for <span class="ss-results-query">"${search.query.string}"</span> found.
		</span>`
				: `<span>No results found.</span>`
		}`,
	};

	const props = mergeProps('searchHeader', globalTheme, defaultProps, properties);

	const { controller, disableStyles, style } = props;

	let { titleText, subTitleText, oqText, noResultsText } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.searchheader(), style];
	} else if (style) {
		styling.css = [style];
	}

	if (typeof titleText == 'function') {
		titleText = titleText({ controller });
	}
	if (typeof subTitleText == 'function') {
		subTitleText = subTitleText({ controller });
	}
	if (typeof oqText == 'function') {
		oqText = oqText({ controller });
	}
	if (typeof noResultsText == 'function') {
		noResultsText = noResultsText({ controller });
	}

	return (
		<CacheProvider>
			<header className="ss__search-header">
				{landingPage ? (
					<h3 className="ss__search-header--landingPageTitle">{landingPage.title}</h3>
				) : (
					<Fragment>
						{pagination.totalResults ? (
							<>
								<h3
									className="ss__search-header--title"
									aria-atomic="true"
									aria-live="polite"
									aria-label={`Now showing ${pagination.totalResults} items in the product grid`}
									dangerouslySetInnerHTML={{ __html: titleText as string }}
								></h3>

								{subTitleText && (
									<h4
										className="ss__search-header--subtitle"
										aria-atomic="true"
										aria-live="polite"
										dangerouslySetInnerHTML={{ __html: subTitleText as string }}
									></h4>
								)}

								{search.originalQuery && (
									<h5
										className="ss__search-header--oq"
										aria-atomic="true"
										aria-live="polite"
										aria-label={`No results found for ${search.originalQuery?.string}, showing results for ${search.query?.string} instead`}
										dangerouslySetInnerHTML={{ __html: oqText as string }}
									></h5>
								)}
							</>
						) : (
							pagination.totalResults === 0 && (
								<h3
									className="ss__search-header--noresultstitle"
									aria-atomic="true"
									aria-live="polite"
									aria-label={`No results found for ${search.query?.string}`}
									dangerouslySetInnerHTML={{ __html: noResultsText as string }}
								></h3>
							)
						)}
					</Fragment>
				)}
			</header>
		</CacheProvider>
	);
});

export interface SearchHeaderProps extends ComponentProps {
	controller: SearchController;
	titleText?: string | ((data: data) => string);
	subTitleText?: string | ((data: data) => string);
	oqText?: string | ((data: data) => string);
	noResultsText?: string | ((data: data) => string);
}

interface data {
	controller: SearchController;
}
