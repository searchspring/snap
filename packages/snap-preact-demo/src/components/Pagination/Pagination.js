import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';
import { withStore } from '../../services/providers';

@withStore
@observer
export class Pagination extends Component {
	render() {
		const pagination = this.props.store.pagination;
		const pages = pagination.getPages(5);

		//TODO
		//Add real working URLS to all of the hrefs when the URLManager is set up
		return (
			<div class="ss-pagination-row">
				{/* Prev */}
				{pagination.previous && (
					<div class="ss-page ss-page-previous">
						<a {...pagination.previous.url.link} class="ss-page-link">
							Previous
						</a>
					</div>
				)}

				{/* first */}
				{pagination.totalPages > 5 && pagination.page > 3 && (
					<>
						<div class="ss-page ss-page-first">
							<a {...pagination.first.url.link} class="ss-page-link">
								{pagination.first.number}
							</a>
						</div>
						<Elipsis />
					</>
				)}

				{/* pages */}
				{pages &&
					pages.map((page) => (
						<div class={page.active ? 'ss-active ss-page' : 'ss-page'}>
							{page.active ? (
								<span class="ss-page-label">{page.number}</span>
							) : (
								<a {...page.url.link} class="ss-page-link">
									{page.number}
								</a>
							)}
						</div>
					))}

				{/* last page */}
				{pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
					<>
						<Elipsis />
						<div class="ss-page ss-page-last">
							<a {...pagination.last.url.link} class="ss-page-link">
								{pagination.last.number}
							</a>
						</div>
					</>
				)}

				{/* next */}
				{pagination.next && (
					<div class="ss-page ss-page-next">
						<a {...pagination.next.url.link} class="ss-page-link">
							Next
						</a>
					</div>
				)}
			</div>
		);
	}
}

class Elipsis extends Component {
	render() {
		return (
			<div class="ss-page ss-page-hellip">
				<span class="ss-page-label">&hellip;</span>
			</div>
		);
	}
}

@withStore
@observer
export class TotalResults extends Component {
	render() {
		const pagination = this.props.store.pagination;

		return (
			<div>
				<span>
					Page{pagination.multiplePages ? 's' : ''}: {pagination.page} of {pagination.totalPages}
				</span>
			</div>
		);
	}
}
