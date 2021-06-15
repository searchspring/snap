import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { SortBy } from './SortBy';
import { PerPage } from './PerPage';
import { SidebarContents } from '../Sidebar/Sidebar';

import { Button, Pagination, Slideout, withStore } from '@searchspring/snap-preact-components';

@withStore
@observer
export class Toolbar extends Component {
	render() {
		const { pagination } = this.props.store;

		return (
			<div class="ss-toolbar ss-toolbar-top">
				<Slideout displayAt={'(max-width: 991px)'} buttonContent={slideoutButton()}>
					<Fragment>
						<h3>Filters</h3>
						<SidebarContents />
					</Fragment>
				</Slideout>

				<div class="ss-toolbar-row">
					<div class="ss-toolbar-col">
						<SortBy />
					</div>

					<div class="ss-toolbar-col">
						<PerPage />
					</div>
					<div class="ss-toolbar-col pagination">{pagination.totalPages > 1 && <Pagination pagination={pagination} spread={3} />}</div>
				</div>
			</div>
		);
	}
}

const slideoutButton = () => {
	return (
		<Button
			style={{
				margin: '0 10px',
				display: 'block',
				width: '100%',
				boxSizing: 'border-box',
				textAlign: 'center',
			}}
		>
			Show Filters
		</Button>
	);
};
