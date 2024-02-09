import { h, Component } from 'preact';
import { observer } from 'mobx-react';

import {
	Pagination,
	Results as ResultsComponent,
	LoadMore,
	withStore,
	withController,
	withSnap,
	Recommendation,
	useCreateController,
} from '@searchspring/snap-preact/components';

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
		const results = this.props.store.results;
		const pagination = this.props.store.pagination;
		const controller = this.props.controller;

		return (
			<div className="ss-results">
				<Toolbar />

				<div className="clear"></div>

				<Profile name="results" controller={controller}>
					<div id="ss_results">
						<ResultsComponent breakpoints={resultsBreakpoints} controller={controller} results={results} />
					</div>
				</Profile>

				<div className="clear"></div>

				<div className={`ss-toolbar ${controller.config.settings.infinite ? 'ss-toolbar-bottom-infinite' : 'ss-toolbar-bottom'}`}>
					{(() => {
						if (controller.config.settings.infinite) {
							return <LoadMore controller={this.props.controller} progressIndicator="radial" />;
						} else if (pagination.totalPages > 1) {
							return <Pagination pagination={pagination} />;
						}
					})()}
				</div>

				<div className="clear"></div>
			</div>
		);
	}
}

type NoResultsProps = {
	store?: SearchStore;
	controller?: SearchController;
	snap?: Snap;
};

@withSnap
@withController
@withStore
@observer
export class NoResults extends Component<NoResultsProps> {
	render() {
		const store = this.props.store;
		const dym = store.search.didYouMean;

		const recsController = useCreateController<RecommendationController>(this.props.snap, 'recommendation', {
			id: 'no-results',
			tag: 'no-results',
			branch: 'production',
		});
		if (!recsController?.store?.loaded && recsController?.store.error?.type !== 'error') {
			recsController?.search();
		}

		return (
			<div className="ss-no-results">
				<div className="ss-no-results-container">
					{dym && (
						<p className="ss-did-you-mean">
							Did you mean <a href={dym.url.href}>{dym.string}</a>?
						</p>
					)}
				</div>

				<div className="ss-no-results-container">
					<h4 className="ss-title">Suggestions</h4>

					<ul className="ss-suggestion-list">
						<li>Check for misspellings.</li>
						<li>Remove possible redundant keywords (ie. "products").</li>
						<li>Use other words to describe what you are searching for.</li>
					</ul>

					<p>
						Still can't find what you're looking for? <a href="/urlhere.html">Contact us</a>.
					</p>

					<div className="ss-contact ss-location">
						<h4 className="ss-title">Address</h4>
						<p>
							1234 Random Street
							<br />
							Some City, XX, 12345
						</p>
					</div>

					<div className="ss-contact ss-hours">
						<h4 className="ss-title">Hours</h4>
						<p>
							Mon - Sat, 00:00am - 00:00pm
							<br />
							Sun, 00:00am - 00:00pm
						</p>
					</div>

					<div className="ss-contact ss-phone">
						<h4 className="ss-title">Call Us</h4>
						<p>
							<strong>Telephone:</strong> 123-456-7890
							<br />
							<strong>Toll Free:</strong> 123-456-7890
						</p>
					</div>

					<div className="ss-contact ss-email">
						<h4 className="ss-title">Email</h4>
						<p>
							<a href="mailto:email@sitename.com">email@sitename.com</a>
						</p>
					</div>
					<div>{recsController?.store?.loaded && <Recommendation controller={recsController} />}</div>
				</div>
			</div>
		);
	}
}
