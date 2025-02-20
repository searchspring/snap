import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { SortBy } from './SortBy';
import { PerPage } from './PerPage';
import { SidebarContents } from '../Sidebar/Sidebar';

import { Button, Pagination, Slideout, withStore, useMediaQuery, withController } from '@searchspring/snap-preact-components';

type ToolBarProps = {
	store?: SearchStore;
	controller?: SearchController;
};

const mobileMediaQuery = '(max-width: 991px)';

@withStore
@withController
@observer
export class Toolbar extends Component<ToolBarProps> {
	render() {
		const { pagination } = this.props.store;
		const infiniteEnabled = Boolean(this.props.controller?.config.settings.infinite);
		const isMobile = useMediaQuery(mobileMediaQuery);

		return (
			<div className="ss-toolbar ss-toolbar-top">
				<Slideout displayAt={mobileMediaQuery} buttonContent={<SlideoutButton />}>
					<Fragment>
						<h3>Filters</h3>
						<SidebarContents />
					</Fragment>
				</Slideout>

				<div class="ss-toolbar-row">
					<div className="ss-toolbar-col">
						<SortBy />
					</div>

					<div className="ss-toolbar-col">
						<PerPage />
					</div>
					<div className="ss-toolbar-col pagination">
						{!infiniteEnabled && pagination.totalPages > 1 && !isMobile && <Pagination pagination={pagination} spread={3} />}
					</div>
				</div>
			</div>
		);
	}
}

const SlideoutButton = () => {
	return (
		<>
			<Button
				style={{
					margin: '10px 0',
					display: 'block',
					width: '100%',
					boxSizing: 'border-box',
					textAlign: 'center',
				}}
			>
				Show Filters
			</Button>
		</>
	);
};
