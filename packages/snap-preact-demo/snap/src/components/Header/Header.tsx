import { h, Fragment } from 'preact';
import { observer } from 'mobx-react-lite';

import { withController } from '@searchspring/snap-preact/components';

type HeaderProps = {
	controller?: SearchController;
};

export const Header = withController(
	observer(({ controller }: HeaderProps) => {
		const { pagination, search } = controller.store;
		const landingPage = controller.store.merchandising.landingPage;

		return (
			<header className="ss-header-container">
				{landingPage ? (
					<h3 className="ss__search-header--landingPageTitle">{landingPage.title}</h3>
				) : (
					<Fragment>
						{pagination.totalResults ? (
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
										No results found for <em>"{search.originalQuery.string}"</em>, showing results for <em>"{search.query.string}"</em> instead.
									</div>
								)}
							</h3>
						) : (
							pagination.totalResults === 0 && (
								<h3 className="ss-title ss-results-title ss-no-results-title">
									{search?.query ? (
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
		);
	})
);
