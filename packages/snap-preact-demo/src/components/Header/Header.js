import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';
import { withStore } from '../../services/providers';

@withStore
@observer
export class Header extends Component {
	render() {
		const { pagination, search, custom } = this.props.store;

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

				{/* <div ng-if="originalQuery" class="ss-oq">
					Search instead for "<a class="ss-oq-link" href="{{ originalQuery.url }}">{{ originalQuery.value }}</a>"
				</div> */}

				{/* <Merch position="header"/> */}
			</header>
		);
	}
}
