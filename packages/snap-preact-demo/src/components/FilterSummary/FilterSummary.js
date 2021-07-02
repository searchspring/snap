import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';
import { withStore, withController } from '@searchspring/snap-preact-components';

@withStore
@withController
@observer
export class FilterSummary extends Component {
	render() {
		const { facets, filters, slideOutTriggered } = this.props.store;
		const controller = this.props.controller;
		const removeAll = controller?.urlManager.remove('filter');

		return filters.length ? (
			<div class="ss-summary">
				<div class="ss-summary-container">
					{!slideOutTriggered && !facets.horizontal && <h4 class="ss-title">Current Filters</h4>}

					<div class="ss-list ss-flex-wrap-center">
						{(slideOutTriggered || facets.horizontal) && (
							<div class="ss-list-option ss-list-title">
								<span class="ss-summary-label">Current Filters:</span>
							</div>
						)}

						{filters &&
							filters.map((filter) => (
								<div class="ss-list-option">
									<a {...filter.url.link} class="ss-list-link">
										<span class="ss-summary-label">{filter.facet.label}:</span> <span class="ss-summary-value">{filter.value.label}</span>
									</a>
								</div>
							))}

						<div class="ss-list-option ss-summary-reset">
							<a {...removeAll.link} class="ss-list-link">
								Clear All
							</a>
							<a class="ss-list-link">Clear All</a>
						</div>
					</div>
				</div>
			</div>
		) : null;
	}
}
