import { h } from 'preact';
import { useEffect } from 'preact/hooks';

import { observer } from 'mobx-react';

import {
	Pagination,
	Results as ResultsComponent,
	LoadMore,
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

export const Results = withController(
	observer(({ controller }: ResultsProps) => {
		const store = controller.store;
		const results = store.results;
		const pagination = store.pagination;

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
					{controller.config.settings.infinite ? (
						<LoadMore controller={controller} />
					) : (
						pagination.totalPages > 1 && <Pagination pagination={pagination} />
					)}
				</div>

				<div className="clear"></div>
			</div>
		);
	})
);

export const NoResults = withSnap(
	withController(
		observer(({ controller, snap }) => {
			const store = controller.store;
			const dym = store.search.didYouMean;

			const recsController = useCreateController<RecommendationController>(snap, 'recommendation', {
				id: 'no-results',
				tag: 'no-results',
				branch: 'production',
			});

			useEffect(() => {
				if (!recsController?.store?.loaded && recsController?.store.error?.type !== 'error') {
					recsController?.search();
				}
			}, [recsController]);

			return (
				<div className="ss-no-results">
					{dym && (
						<div className="ss-no-results-container">
							<p className="ss-did-you-mean">
								Did you mean <a href={dym.url.href}>{dym.string}</a>?
							</p>
						</div>
					)}

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
						<div style={{ maxWidth: '100%' }}>{recsController?.store?.loaded && <Recommendation controller={recsController} />}</div>
					</div>
				</div>
			);
		})
	)
);
