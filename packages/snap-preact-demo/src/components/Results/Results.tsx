import { h, Component } from 'preact';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react';

import { Pagination, Results as ResultsComponent, withStore, withController, useIntersectionAdvanced } from '@searchspring/snap-preact-components';

import { Profile } from '../Profile/Profile';
import { Toolbar } from '../Toolbar/Toolbar';

type ResultsProps = {
	store?: SearchStore;
	controller?: SearchController;
};

const resultsBreakpoints = {
	0: {
		columns: 2,
	},
	768: {
		columns: 3,
	},
	991: {
		columns: 4,
	},
};

@withStore
@withController
@observer
export class Results extends Component<ResultsProps> {
	render() {
		const loading = this.props.store.loading;
		const results = this.props.store.results;
		const pagination = this.props.store.pagination;
		const controller = this.props.controller;

		const infiniteEnabled = Boolean(controller.config.settings.infinite);
		const infiniteRef = useRef(null);
		if (infiniteEnabled) {
			const atBottom = useIntersectionAdvanced(infiniteRef, {
				rootMargin: '0px',
				threshold: 1,
				minVisibleTime: 300,
			});

			if (atBottom && pagination.next && !loading && pagination.totalResults > 0) {
				setTimeout(() => {
					pagination.next.url.go({ history: 'replace' });
				});
			}
		}

		return (
			<div class="ss-results">
				<Toolbar />

				<div class="clear"></div>

				<Profile name="results" controller={controller}>
					<div id="ss_results">
						<ResultsComponent breakpoints={resultsBreakpoints} controller={controller} results={results} />
					</div>
					{infiniteEnabled && <div style={{ display: loading ? 'none' : 'block' }} ref={infiniteRef}></div>}
				</Profile>

				<div class="clear"></div>

				<div class="ss-toolbar ss-toolbar-bottom">{!infiniteEnabled && pagination.totalPages > 1 && <Pagination pagination={pagination} />}</div>
				{infiniteEnabled && (
					<div class="ss-page-circle">
						<span class="ss-page-circle-number">{pagination.current.number}</span>
					</div>
				)}

				<div class="clear"></div>
			</div>
		);
	}
}

type NoResultsProps = {
	store?: SearchStore;
	controller?: SearchController;
};

@withController
@withStore
@observer
export class NoResults extends Component<NoResultsProps> {
	render() {
		const store = this.props.store;
		const dym = store.search.didYouMean;

		return (
			<div class="ss-no-results">
				<div class="ss-no-results-container">
					{dym && (
						<p class="ss-did-you-mean">
							Did you mean <a href={dym.url.href}>{dym.string}</a>?
						</p>
					)}
				</div>

				<div class="ss-no-results-container">
					<h4 class="ss-title">Suggestions</h4>

					<ul class="ss-suggestion-list">
						<li>Check for misspellings.</li>
						<li>Remove possible redundant keywords (ie. "products").</li>
						<li>Use other words to describe what you are searching for.</li>
					</ul>

					<p>
						Still can't find what you're looking for? <a href="/urlhere.html">Contact us</a>.
					</p>

					<div class="ss-contact ss-location">
						<h4 class="ss-title">Address</h4>
						<p>
							1234 Random Street
							<br />
							Some City, XX, 12345
						</p>
					</div>

					<div class="ss-contact ss-hours">
						<h4 class="ss-title">Hours</h4>
						<p>
							Mon - Sat, 00:00am - 00:00pm
							<br />
							Sun, 00:00am - 00:00pm
						</p>
					</div>

					<div class="ss-contact ss-phone">
						<h4 class="ss-title">Call Us</h4>
						<p>
							<strong>Telephone:</strong> 123-456-7890
							<br />
							<strong>Toll Free:</strong> 123-456-7890
						</p>
					</div>

					<div class="ss-contact ss-email">
						<h4 class="ss-title">Email</h4>
						<p>
							<a href="mailto:email@sitename.com">email@sitename.com</a>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
