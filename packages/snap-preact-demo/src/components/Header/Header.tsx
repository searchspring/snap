import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { withController, Banner } from '@searchspring/snap-preact-components';
import { ContentType } from '@searchspring/snap-store-mobx';

type HeaderProps = {
	controller?: SearchController;
};

@withController
@observer
export class Header extends Component<HeaderProps> {
	render() {
		const { pagination, search } = this.props.controller.store;

		const landingPage = this.props.controller.store.merchandising.landingPage;
		return (
			<header class="ss-header-container">
				<Banner type={ContentType.HEADER} content={this.props.controller.store.merchandising.content} />
				{landingPage ? (
					<h3 className="ss__search-header--landingPageTitle">{landingPage.title}</h3>
				) : (
					<Fragment>
						{pagination.totalResults ? (
							<h3
								class="ss-title ss-results-title"
								aria-atomic="true"
								aria-live="polite"
								aria-label={`Now showing ${pagination.totalResults} items in the product grid`}
							>
								{`Showing `}
								{pagination.multiplePages && <span class="ss-results-count-range">{` ${pagination.begin} - ${pagination.end} of `}</span>}
								<span class="ss-results-count-total">{pagination.totalResults}</span>
								{` result${pagination.totalResults == 1 ? '' : 's'}`}
								{search?.query && (
									<span>
										{` for `}
										<span class="ss-results-query">"{search.query.string}"</span>
									</span>
								)}
								{search?.originalQuery && (
									<div class="ss-oq">
										No results found for <em>"{search.originalQuery.string}"</em>, showing results for <em>"{search.query.string}"</em> instead.
									</div>
								)}
							</h3>
						) : (
							pagination.totalResults === 0 && (
								<h3 class="ss-title ss-results-title ss-no-results-title">
									{search?.query ? (
										<span>
											No results for <span class="ss-results-query">"{search.query.string}"</span> found.
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
	}
}
