import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { withController } from '@searchspring/snap-preact-components';

type HeaderProps = {
	controller?: SearchController;
};

@withController
@observer
export class Header extends Component<HeaderProps> {
	render() {
		const { pagination, search, custom } = this.props.controller.store;

		return (
			<header class="ss-header-container">
				{pagination.totalResults ? (
					<h3 class="ss-title ss-results-title">
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
			</header>
		);
	}
}