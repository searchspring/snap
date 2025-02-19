import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import { Select, withController } from '@searchspring/snap-preact/components';

type PerPageProps = {
	controller?: SearchController;
};

export const PerPage = withController(
	observer(({ controller }: PerPageProps) => {
		const store = controller.store;
		const { pagination } = store;

		return (
			<div className="ss-per-page">
				<Select
					label="Per Page"
					options={pagination.pageSizeOptions}
					selected={{ label: `Show ${pagination.pageSize}`, value: pagination.pageSize }}
					onSelect={(e, option) => {
						pagination.setPageSize(+option.value);
					}}
				/>
			</div>
		);
	})
);
