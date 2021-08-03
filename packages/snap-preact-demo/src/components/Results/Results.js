import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { Pagination, Results as ResultsComponent, Button, withStore, withController } from '@searchspring/snap-preact-components';

import { Profile } from '../Profile/Profile';
import { Toolbar } from '../Toolbar/Toolbar';

@withStore
@withController
@observer
export class Results extends Component {
	render() {
		const results = this.props.store.results;
		const pagination = this.props.store.pagination;
		const controller = this.props.controller;
		const resultsTheme = {
			components: {
				result: {
					buttonSlot: <Button content="Add to Cart" style={{ display: 'block', textAlign: 'center' }} />,
				},
			},
		};

		return (
			<div class="ss-results">
				{pagination.previous && (
					<button
						onClick={() => {
							pagination.previous.url.go();
						}}
					>
						Load More
					</button>
				)}

				<Profile name="results" controller={controller}>
					<ResultsComponent controller={controller} results={results} theme={resultsTheme} />
				</Profile>

				{pagination.next && (
					<button
						onClick={() => {
							pagination.next.url.go();
						}}
					>
						Load More
					</button>
				)}
				{/* <div class="ss-toolbar ss-toolbar-bottom">{pagination.totalPages > 1 && <Pagination pagination={pagination} />}</div> */}
			</div>
		);
	}
}

@withController
@withStore
@observer
export class NoResults extends Component {
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
