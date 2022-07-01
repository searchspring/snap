import { h, Fragment, Component } from 'preact';
import { observer } from 'mobx-react';

import { Select, withStore } from '@searchspring/snap-preact-components';

type PerPageProps = {
	store?: SearchStore;
};

@withStore
@observer
export class PerPage extends Component<PerPageProps> {
	constructor(props: PerPageProps) {
		super(props);
	}

	render() {
		const { pagination } = this.props.store;

		return (
			<div class="ss-per-page">
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
	}
}
