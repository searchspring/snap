import { h, Fragment } from 'preact';
import { observer } from 'mobx-react-lite';

import { SortBy } from './SortBy';
import { PerPage } from './PerPage';
import { SidebarContents } from '../Sidebar/Sidebar';

import { Button, Pagination, Slideout, withController, useMediaQuery } from '@searchspring/snap-preact/components';

type ToolBarProps = {
	store?: SearchStore;
	controller?: SearchController;
};

const mobileMediaQuery = '(max-width: 991px)';

export const Toolbar = withController(
	observer(({ controller }: ToolBarProps) => {
		const store = controller.store;
		const { pagination } = store;
		const isMobile = useMediaQuery(mobileMediaQuery);

		return (
			<div className="ss-toolbar ss-toolbar-top">
				<Slideout displayAt={mobileMediaQuery} buttonContent={<SlideoutButton />}>
					<Fragment>
						<h3>Filters</h3>
						<SidebarContents />
					</Fragment>
				</Slideout>

				<div className="ss-toolbar-row">
					<div className="ss-toolbar-col">
						<SortBy />
					</div>

					<div className="ss-toolbar-col">
						<PerPage />
					</div>
					<div className="ss-toolbar-col pagination">
						{pagination.totalPages > 1 && !isMobile && !controller.config?.settings?.infinite?.enabled && <Pagination pagination={pagination} />}
					</div>
				</div>
			</div>
		);
	})
);

const SlideoutButton: React.FC = () => {
	return (
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
	);
};
